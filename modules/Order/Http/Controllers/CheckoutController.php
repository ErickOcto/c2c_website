<?php

namespace Modules\Order\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Midtrans\Config as MidtransConfig;
use Midtrans\Snap;
use Modules\Cart\Models\Cart;
use Modules\Order\Models\Order;
use Modules\Order\Models\OrderItem;
use Modules\Shipping\Services\RajaongkirService;
use Modules\Transaction\Models\Transaction;

class CheckoutController extends Controller
{
    public function __construct(
        private RajaongkirService $rajaongkirService,
    ) {
        $this->configureMidtrans();
    }

    /**
     * Display the checkout page with cart items grouped by seller.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $cart = Cart::where('user_id', $request->user()->id)->first();

        if (! $cart || $cart->items()->count() === 0) {
            return redirect()->route('cart.index');
        }

        $cartItems = $cart->items()
            ->with(['product.images', 'product.category', 'product.seller.profile'])
            ->get();

        // Group items by seller
        $sellerGroups = $cartItems->groupBy(fn ($item) => $item->product->user_id)
            ->map(function ($items, $sellerId) {
                $seller = $items->first()->product->seller;
                $subtotal = $items->sum(fn ($item) => $item->product->price * $item->quantity);

                return [
                    'seller_id' => $sellerId,
                    'seller_name' => $seller->name,
                    'seller_city' => $seller->profile?->city ?? 'Unknown',
                    'items' => $items->values(),
                    'subtotal' => $subtotal,
                    'shipping' => null,
                ];
            })
            ->values();

        $profile = $request->user()->profile;
        $couriers = config('rajaongkir.couriers');

        return Inertia::render('checkout', [
            'sellerGroups' => $sellerGroups,
            'profile' => $profile,
            'couriers' => $couriers,
            'midtransClientKey' => config('midtrans.client_key'),
        ]);
    }

    /**
     * Calculate shipping cost for a seller group.
     */
    public function calculateShipping(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'seller_id' => ['required', 'exists:users,id'],
            'courier' => ['required', 'string'],
            'weight' => ['required', 'integer', 'min:1'],
        ]);

        $buyerProfile = $request->user()->profile;

        if (! $buyerProfile?->city_id) {
            return response()->json([
                'error' => 'Please set your city in your profile settings first.',
            ], 422);
        }

        // Get seller's origin city from their profile
        $seller = \App\Models\User::with('profile')->findOrFail($validated['seller_id']);
        $originCityId = $seller->profile?->city_id ?? $this->resolveCityId($seller->profile?->city);

        if (! $originCityId) {
            return response()->json([
                'error' => 'Seller has not configured their city. Cannot calculate shipping.',
            ], 422);
        }

        $results = $this->rajaongkirService->calculateCost(
            origin: $originCityId,
            destination: $buyerProfile->city_id,
            weight: max($validated['weight'], 100),
            courier: $validated['courier'],
        );

        return response()->json([
            'results' => $results,
        ]);
    }

    /**
     * Process the checkout: create transaction, orders, and get Midtrans snap token.
     */
    public function process(Request $request): JsonResponse
    {
        $request->validate([
            'seller_shipments' => ['required', 'array', 'min:1'],
            'seller_shipments.*.seller_id' => ['required', 'exists:users,id'],
            'seller_shipments.*.courier' => ['required', 'string'],
            'seller_shipments.*.service' => ['required', 'string'],
            'seller_shipments.*.cost' => ['required', 'numeric', 'min:0'],
            'seller_shipments.*.etd' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (! $cart || $cart->items()->count() === 0) {
            return response()->json(['error' => 'Cart is empty.'], 422);
        }

        $cartItems = $cart->items()->with('product')->get();
        $sellerShipments = collect($request->input('seller_shipments'))->keyBy('seller_id');

        // Validate all sellers have a shipping option
        $sellerIds = $cartItems->pluck('product.user_id')->unique();
        $missingSellers = $sellerIds->diff($sellerShipments->keys());

        if ($missingSellers->isNotEmpty()) {
            return response()->json([
                'error' => 'Please select a shipping option for all sellers.',
            ], 422);
        }

        try {
            return DB::transaction(function () use ($user, $cart, $cartItems, $sellerShipments, $request) {
                $grandTotal = 0;
                $ordersData = [];

                // Group cart items by seller
                $groupedItems = $cartItems->groupBy(fn ($item) => $item->product->user_id);

                foreach ($groupedItems as $sellerId => $items) {
                    $shipment = $sellerShipments[$sellerId];
                    $itemsTotal = $items->sum(fn ($item) => $item->product->price * $item->quantity);
                    $shippingCost = $shipment['cost'];
                    $orderTotal = $itemsTotal + $shippingCost;
                    $grandTotal += $orderTotal;

                    $ordersData[] = [
                        'seller_id' => $sellerId,
                        'items' => $items,
                        'total_price' => $itemsTotal,
                        'shipping_courier' => $shipment['courier'],
                        'shipping_service' => $shipment['service'],
                        'shipping_cost' => $shippingCost,
                        'shipping_etd' => $this->parseEtd($shipment['etd'] ?? null),
                    ];
                }

                // Create a single transaction
                $transaction = Transaction::create([
                    'buyer_id' => $user->id,
                    'payment_method' => 'midtrans',
                    'payment_status' => 'pending',
                    'gross_amount' => $grandTotal,
                ]);

                // Create orders for each seller
                $midtransItems = [];

                foreach ($ordersData as $orderData) {
                    $order = Order::create([
                        'transaction_id' => $transaction->id,
                        'buyer_id' => $user->id,
                        'seller_id' => $orderData['seller_id'],
                        'total_price' => $orderData['total_price'],
                        'shipping_courier' => $orderData['shipping_courier'],
                        'shipping_service' => $orderData['shipping_service'],
                        'shipping_cost' => $orderData['shipping_cost'],
                        'shipping_etd' => $orderData['shipping_etd'],
                        'status' => 'pending',
                    ]);

                    foreach ($orderData['items'] as $cartItem) {
                        OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $cartItem->product_id,
                            'quantity' => $cartItem->quantity,
                            'price' => $cartItem->product->price,
                        ]);

                        // Build Midtrans item details
                        $midtransItems[] = [
                            'id' => "PROD-{$cartItem->product_id}",
                            'price' => (int) $cartItem->product->price,
                            'quantity' => $cartItem->quantity,
                            'name' => substr($cartItem->product->name, 0, 50),
                        ];
                    }

                    // Add shipping as a line item
                    if ($orderData['shipping_cost'] > 0) {
                        $midtransItems[] = [
                            'id' => "SHIP-{$order->id}",
                            'price' => (int) $orderData['shipping_cost'],
                            'quantity' => 1,
                            'name' => strtoupper($orderData['shipping_courier']) . ' - ' . $orderData['shipping_service'],
                        ];
                    }
                }

                // Create Midtrans Snap token
                $midtransParams = [
                    'transaction_details' => [
                        'order_id' => "TXN-{$transaction->id}-" . time(),
                        'gross_amount' => (int) $grandTotal,
                    ],
                    'customer_details' => [
                        'first_name' => $user->name,
                        'email' => $user->email,
                    ],
                    'item_details' => $midtransItems,
                ];

                $snapToken = Snap::getSnapToken($midtransParams);

                $transaction->update([
                    'snap_token' => $snapToken,
                ]);

                // Clear the cart
                $cart->items()->delete();

                return response()->json([
                    'snap_token' => $snapToken,
                    'transaction_id' => $transaction->id,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Checkout failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Checkout failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Configure Midtrans SDK.
     */
    private function configureMidtrans(): void
    {
        MidtransConfig::$serverKey = config('midtrans.server_key');
        MidtransConfig::$isProduction = config('midtrans.is_production');
        MidtransConfig::$isSanitized = config('midtrans.is_sanitized');
        MidtransConfig::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Resolve a city name to a Rajaongkir city ID (for sellers).
     * If the seller profile stores a city_id directly, use that instead.
     */
    private function resolveCityId(?string $cityName): ?int
    {
        if (! $cityName) {
            return null;
        }

        // Try to parse as integer (already a city_id)
        if (is_numeric($cityName)) {
            return (int) $cityName;
        }

        // Look up from cached cities
        $cities = $this->rajaongkirService->getCities();

        foreach ($cities as $city) {
            if (strcasecmp($city['city_name'], $cityName) === 0) {
                return (int) $city['city_id'];
            }
        }

        return null;
    }

    /**
     * Parse ETD string (e.g. "1-2") to a single integer (max days).
     */
    private function parseEtd(?string $etd): ?int
    {
        if (! $etd) {
            return null;
        }

        // Extract digits, take the last one (max)
        preg_match_all('/\d+/', $etd, $matches);

        if (empty($matches[0])) {
            return null;
        }

        return (int) end($matches[0]);
    }
}
