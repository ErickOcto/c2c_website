<?php

namespace Modules\Cart\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Cart\Models\Wishlist;
use Modules\Product\Models\Product;

class WishlistController extends Controller
{
    /**
     * Display the user's wishlist page.
     */
    public function index(Request $request): Response
    {
        $wishlists = Wishlist::with(['product.images', 'product.seller.profile'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('wishlist', [
            'wishlists' => $wishlists,
        ]);
    }

    /**
     * Toggle a product in the wishlist.
     */
    public function toggle(Request $request, Product $product): RedirectResponse
    {
        $user = $request->user();

        $wishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            $status = 'Product removed from wishlist.';
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
            ]);
            $status = 'Product added to wishlist.';
        }

        // Use back() so it works from both the product page and the wishlist page.
        return back()->with('status', $status);
    }
}
