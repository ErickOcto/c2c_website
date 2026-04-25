<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Feedback\Models\Report;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Report::with(['reporter', 'product.seller'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $reports = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/reports', [
            'reports' => $reports,
            'filters' => $request->only(['status']),
        ]);
    }

    public function updateStatus(Request $request, Report $report): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,reviewed,resolved,dismissed'],
        ]);

        $report->update(['status' => $request->input('status')]);

        return back()->with('status', 'Report updated.');
    }

    public function removeProduct(Report $report): RedirectResponse
    {
        $product = $report->product;

        if ($product) {
            $product->update(['status' => 'inactive']);
        }

        $report->update(['status' => 'resolved']);

        return back()->with('status', 'Product removed and report resolved.');
    }
}
