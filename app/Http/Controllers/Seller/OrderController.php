<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Notifications\SystemNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Order\Models\Order;
use Modules\Product\Models\Product;
use Modules\Shipping\Models\Shipping;

class OrderController extends Controller
{
    /**
     * Display seller's orders with filterable statuses.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $sellerProductIds = Product::where('user_id', $user->id)->pluck('id');

        $query = Order::whereHas('items', function ($q) use ($sellerProductIds) {
            $q->whereIn('product_id', $sellerProductIds);
        })->with(['buyer', 'items.product.images', 'shipping']);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('seller/orders', [
            'orders' => $orders,
            'currentStatus' => $request->input('status', 'all'),
        ]);
    }

    /**
     * Update order status. When shipping, also save the tracking record.
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:paid,shipped,completed,cancelled'],
            'tracking_number' => [
                'required_if:status,shipped',
                'nullable',
                'string',
                'max:100',
                Rule::unique('shippings', 'tracking_number')->ignore($order->id, 'order_id'),
            ],
        ], [
            'tracking_number.unique' => 'This tracking number is already used for another shipment.',
        ]);

        $newStatus = $request->input('status');

        $order->update(['status' => $newStatus]);

        if ($newStatus === 'shipped' && $request->filled('tracking_number')) {
            Shipping::updateOrCreate(
                ['order_id' => $order->id],
                [
                    'courier' => $order->shipping_courier ?? 'N/A',
                    'tracking_number' => $request->input('tracking_number'),
                    'status' => 'shipped',
                ]
            );
        }

        // Notify the buyer of order status changes
        if ($newStatus === 'shipped') {
            $trackingNumber = $request->input('tracking_number') ?? 'N/A';
            $order->buyer->notify(new SystemNotification(
                'Package On The Way! 🚚',
                'Your package for Order #'.$order->id.' has been shipped via '.strtoupper($order->shipping_courier ?? '').' ('.($order->shipping_service ?? 'Standard').'). Tracking number: '.$trackingNumber.'.',
                '/dashboard'
            ));
        } elseif ($newStatus === 'completed') {
            $order->buyer->notify(new SystemNotification(
                'Order Completed! 🎉',
                'Your package for Order #'.$order->id.' from '.$order->seller->name.' has been delivered successfully. Thank you for shopping with us!',
                '/dashboard'
            ));
        } elseif ($newStatus === 'cancelled') {
            $order->buyer->notify(new SystemNotification(
                'Order Cancelled ❌',
                'Your order #'.$order->id.' has been cancelled.',
                '/dashboard'
            ));
        }

        return back()->with('status', 'Order status updated successfully.');
    }

    /**
     * Export seller orders as CSV for reporting.
     */
    public function exportCsv(Request $request): HttpResponse
    {
        $user = $request->user();
        $sellerProductIds = Product::where('user_id', $user->id)->pluck('id');

        $orders = Order::whereHas('items', function ($q) use ($sellerProductIds) {
            $q->whereIn('product_id', $sellerProductIds);
        })->with(['buyer', 'items.product', 'shipping'])->latest()->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="sales_report_'.now()->format('Y-m-d').'.csv"',
        ];

        $rows = [];
        $rows[] = ['Order ID', 'Date', 'Buyer', 'Items', 'Shipping', 'Tracking', 'Total', 'Status'];

        foreach ($orders as $order) {
            $itemNames = $order->items->map(fn ($i) => ($i->product->name ?? 'Product').' x'.$i->quantity)->implode(', ');
            $rows[] = [
                '#'.$order->id,
                $order->created_at?->format('Y-m-d H:i') ?? '-',
                $order->buyer->name ?? 'Unknown',
                $itemNames,
                strtoupper($order->shipping_courier ?? '').' '.($order->shipping_service ?? ''),
                $order->shipping?->tracking_number ?? '-',
                number_format($order->total_price, 0, '.', ','),
                $order->status,
            ];
        }

        $csv = '';
        foreach ($rows as $row) {
            $csv .= implode(',', array_map(fn ($cell) => '"'.str_replace('"', '""', $cell).'"', $row))."\n";
        }

        return response($csv, 200, $headers);
    }
}
