<?php

namespace Modules\Feedback\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Modules\Feedback\Models\Report;

class ReportController extends Controller
{
    /**
     * Store a product report.
     */
    public function store(Request $request, int $product): RedirectResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        Report::create([
            'reporter_id' => $request->user()->id,
            'product_id' => $product,
            'reason' => $request->input('reason'),
            'description' => $request->input('description', ''),
            'status' => 'pending',
        ]);

        return back();
    }
}
