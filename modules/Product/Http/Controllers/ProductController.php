<?php

namespace Modules\Product\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;
use Modules\Cart\Models\Cart;
use Modules\Product\Models\Category;
use Modules\Product\Models\Product;

class ProductController extends Controller
{
    /**
     * Display the homepage with featured products.
     */
    public function home(Request $request): Response
    {
        $categories = Category::all();

        $featuredProducts = Product::with(['images', 'category', 'seller.profile', 'reviews'])
            ->where('status', 'active')
            ->latest()
            ->take(10)
            ->get();

        $cartItemCount = 0;
        if ($request->user()) {
            $cart = Cart::where('user_id', $request->user()->id)->first();
            $cartItemCount = $cart ? $cart->items()->count() : 0;
        }

        return Inertia::render('welcome', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'cartItemCount' => $cartItemCount,
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }

    /**
     * Display a product detail page.
     */
    public function show(Request $request, Product $product): Response
    {
        $product->load([
            'images',
            'category',
            'seller.profile',
            'reviews.user',
        ]);

        $relatedProducts = Product::with(['images', 'category', 'seller.profile', 'reviews'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'active')
            ->take(6)
            ->get();

        return Inertia::render('products/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Search products with debounced query.
     */
    public function search(Request $request): Response
    {
        $query = Product::with(['images', 'category', 'seller.profile', 'reviews'])
            ->where('status', 'active');

        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }

        if ($request->filled('department')) {
            $query->where('department', $request->input('department'));
        }

        if ($request->filled('condition')) {
            $query->where('condition', $request->input('condition'));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        if ($request->filled('size')) {
            $query->where('size', $request->input('size'));
        }

        if ($request->filled('brand')) {
            $query->where('brand', 'like', "%{$request->input('brand')}%");
        }

        $sort = $request->input('sort', 'newest');
        $query = match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'popular' => $query->withCount('reviews')->orderByDesc('reviews_count'),
            default => $query->latest(),
        };

        $products = $query->paginate(12)->withQueryString();
        $categories = Category::all();

        return Inertia::render('search', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['q', 'department', 'category', 'condition', 'min_price', 'max_price', 'size', 'brand', 'sort']),
        ]);
    }
}
