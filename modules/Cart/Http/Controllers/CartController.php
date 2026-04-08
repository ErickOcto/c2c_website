<?php

namespace Modules\Cart\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Cart\Models\Cart;
use Modules\Cart\Models\CartItem;

class CartController extends Controller
{
    /**
     * Display the cart page.
     */
    public function index(Request $request): Response
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        $cartItems = $cart->items()
            ->with(['product.images', 'product.category', 'product.seller'])
            ->get();

        return Inertia::render('cart', [
            'cartItems' => $cartItems,
        ]);
    }

    /**
     * Add an item to the cart.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'size' => ['nullable', 'string'],
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        $existingItem = $cart->items()
            ->where('product_id', $request->input('product_id'))
            ->where('size', $request->input('size'))
            ->first();

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $existingItem->quantity + $request->input('quantity'),
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $request->input('product_id'),
                'quantity' => $request->input('quantity'),
                'size' => $request->input('size'),
            ]);
        }

        return back();
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartItem->update([
            'quantity' => $request->input('quantity'),
        ]);

        return back();
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(CartItem $cartItem): RedirectResponse
    {
        $cartItem->delete();

        return back();
    }
}
