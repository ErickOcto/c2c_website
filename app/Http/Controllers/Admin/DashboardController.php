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
        ];

        // Monthly new users for chart
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

        // Recent reports
        $recentReports = Report::with(['reporter', 'product'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'monthlyUsers' => $monthlyUsers,
            'recentReports' => $recentReports,
        ]);
    }
}
