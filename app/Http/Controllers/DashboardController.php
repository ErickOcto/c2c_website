<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the buyer's order dashboard.
     */
    public function index(Request $request)
    {
        $transactions = $request->user()->transactions()
            ->with([
                'orders.seller',
                'orders.items.product'
            ])
            ->latest()
            ->get();

        return Inertia::render('dashboard', [
            'transactions' => $transactions
        ]);
    }
}
