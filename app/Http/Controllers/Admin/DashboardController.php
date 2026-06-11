<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Feedback\Models\Report;
use Modules\Order\Models\Order;
use Modules\Product\Models\Product;
use Modules\Transaction\Models\Transaction;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalProducts' => Product::count(),
            'activeProducts' => Product::where('status', 'active')->count(),
            'totalOrders' => Order::count(),
            'totalRevenue' => (float) Transaction::where('payment_status', 'paid')->sum('gross_amount'),
            'pendingReports' => Report::where('status', 'pending')->count(),
            'bannedUsers' => User::where('is_banned', true)->count(),
            'totalSellers' => User::where('role', 'seller')->count(),
            'totalBuyers' => User::where('role', 'buyer')->count(),
        ];

        // Monthly new users (last 6 months)
        $monthlyUsers = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthlyUsers[] = [
                'month' => $month->format('M Y'),
                'count' => User::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
            ];
        }

        // Monthly revenue (last 6 months)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthlyRevenue[] = [
                'month' => $month->format('M Y'),
                'revenue' => (float) Transaction::where('payment_status', 'paid')
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->sum('gross_amount'),
            ];
        }

        // Order status breakdown
        $orderStatuses = Order::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Top 5 sellers by revenue
        $topSellers = User::where('role', 'seller')
            ->withSum(['products as total_revenue' => function ($q) {
                $q->join('order_items', 'products.id', '=', 'order_items.product_id')
                    ->join('orders', 'order_items.order_id', '=', 'orders.id')
                    ->where('orders.status', '!=', 'cancelled');
            }], 'order_items.price')
            ->withCount('products')
            ->orderByDesc('total_revenue')
            ->take(5)
            ->get(['id', 'name', 'email', 'role', 'products_count']);

        // Recent reports
        $recentReports = Report::with(['reporter', 'product'])
            ->latest()
            ->take(5)
            ->get();

        // Recent orders
        $recentOrders = Order::with(['buyer', 'items.product'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'monthlyUsers' => $monthlyUsers,
            'monthlyRevenue' => $monthlyRevenue,
            'orderStatuses' => $orderStatuses,
            'topSellers' => $topSellers,
            'recentReports' => $recentReports,
            'recentOrders' => $recentOrders,
        ]);
    }
}
