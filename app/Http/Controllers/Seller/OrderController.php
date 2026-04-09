<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Order\Models\Order;
use Modules\Product\Models\Product;

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
        })->with(['buyer', 'items.product.images']);

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
     * Update order status (e.g., mark as shipped).
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:paid,shipped,completed,cancelled'],
        ]);

        $order->update(['status' => $request->input('status')]);

        return back()->with('status', 'Order status updated successfully.');
    }
}
