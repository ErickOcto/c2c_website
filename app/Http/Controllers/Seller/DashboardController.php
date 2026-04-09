<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Order\Models\Order;
use Modules\Product\Models\Product;

class DashboardController extends Controller
{
    /**
     * Display the seller dashboard with KPIs and sales data.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // KPI data
        $totalProducts = Product::where('user_id', $user->id)->count();
        $activeProducts = Product::where('user_id', $user->id)->where('status', 'active')->count();

        // Get orders where the seller has products
        $sellerProductIds = Product::where('user_id', $user->id)->pluck('id');

        $newOrders = Order::whereHas('items', function ($query) use ($sellerProductIds) {
            $query->whereIn('product_id', $sellerProductIds);
        })->where('status', 'pending')->count();

        $totalRevenue = Order::whereHas('items', function ($query) use ($sellerProductIds) {
            $query->whereIn('product_id', $sellerProductIds);
        })->where('status', 'completed')->sum('total_price');

        $itemsToShip = Order::whereHas('items', function ($query) use ($sellerProductIds) {
            $query->whereIn('product_id', $sellerProductIds);
        })->where('status', 'paid')->count();

        // Monthly revenue data for chart (last 6 months)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $revenue = Order::whereHas('items', function ($query) use ($sellerProductIds) {
                $query->whereIn('product_id', $sellerProductIds);
            })
                ->where('status', 'completed')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('total_price');

            $monthlyRevenue[] = [
                'month' => $month->format('M Y'),
                'revenue' => (float) $revenue,
            ];
        }

        // Recent orders
        $recentOrders = Order::whereHas('items', function ($query) use ($sellerProductIds) {
            $query->whereIn('product_id', $sellerProductIds);
        })
            ->with(['buyer', 'items.product.images'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('seller/dashboard', [
            'kpis' => [
                'totalProducts' => $totalProducts,
                'activeProducts' => $activeProducts,
                'newOrders' => $newOrders,
                'totalRevenue' => (float) $totalRevenue,
                'itemsToShip' => $itemsToShip,
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'recentOrders' => $recentOrders,
        ]);
    }
}
