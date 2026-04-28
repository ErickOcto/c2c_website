<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Product\Models\Category;
use Modules\Product\Models\Product;
use Modules\Product\Models\ProductImage;

class ProductController extends Controller
{
    /**
     * Display seller's product listings.
     */
    public function index(Request $request): Response
    {
        $products = Product::where('user_id', $request->user()->id)
            ->with(['images', 'category'])
            ->latest()
            ->paginate(12);

        return Inertia::render('seller/products/index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        $categories = Category::all();

        return Inertia::render('seller/products/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:1'],
            'condition' => ['required', 'in:new,good,bad,poor'],
            'department' => ['required', 'in:men,women,kids,unisex'],
            'brand' => ['nullable', 'string', 'max:255'],
            'size' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:50'],
            'material' => ['nullable', 'string', 'max:100'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'max:5120'],
        ]);

        $product = Product::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'active',
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => '/storage/'.$path,
                ]);
            }
        }

        return to_route('seller.products.index')->with('status', 'Product created successfully.');
    }

    /**
     * Show the form for editing a product.
     */
    public function edit(Request $request, Product $product): Response|RedirectResponse
    {
        if ($product->user_id !== $request->user()->id) {
            return to_route('seller.products.index');
        }

        $product->load(['images', 'category']);
        $categories = Category::all();

        return Inertia::render('seller/products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update a product.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        if ($product->user_id !== $request->user()->id) {
            return to_route('seller.products.index');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:1'],
            'condition' => ['required', 'in:new,good,bad,poor'],
            'department' => ['required', 'in:men,women,kids,unisex'],
            'brand' => ['nullable', 'string', 'max:255'],
            'size' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:50'],
            'material' => ['nullable', 'string', 'max:100'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'max:5120'],
        ]);

        $product->update($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => '/storage/'.$path,
                ]);
            }
        }

        return to_route('seller.products.index')->with('status', 'Product updated successfully.');
    }

    /**
     * Delete a product (soft delete via status change).
     */
    public function destroy(Request $request, Product $product): RedirectResponse
    {
        if ($product->user_id !== $request->user()->id) {
            return to_route('seller.products.index');
        }

        $product->update(['status' => 'deleted']);

        return to_route('seller.products.index')->with('status', 'Product deleted successfully.');
    }

    /**
     * Toggle active/inactive status.
     */
    public function toggleStatus(Request $request, Product $product): RedirectResponse
    {
        if ($product->user_id !== $request->user()->id) {
            return to_route('seller.products.index');
        }

        $newStatus = $product->status === 'active' ? 'inactive' : 'active';
        $product->update(['status' => $newStatus]);

        return back()->with('status', 'Product status updated.');
    }
}
