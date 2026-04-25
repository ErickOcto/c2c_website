<?php

namespace Modules\Feedback\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Modules\Feedback\Models\Review;
use Modules\Order\Models\OrderItem;
use Modules\Product\Models\Product;

class ReviewController extends Controller
{
    /**
     * Store a new review. Only buyers who completed an order for this product may review.
     */
    public function store(Request $request, Product $product): RedirectResponse
    {
        $user = $request->user();

        // Ensure the user has a completed order containing this product
        $hasBought = OrderItem::whereHas('order', function ($q) use ($user) {
            $q->where('buyer_id', $user->id)->where('status', 'completed');
        })->where('product_id', $product->id)->exists();

        if (! $hasBought) {
            return back()->withErrors(['review' => 'You can only review products you have purchased.']);
        }

        // Prevent duplicate reviews
        if (Review::where('user_id', $user->id)->where('product_id', $product->id)->exists()) {
            return back()->withErrors(['review' => 'You have already reviewed this product.']);
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return back()->with('status', 'Review submitted successfully!');
    }
}
