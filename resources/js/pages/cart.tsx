import { Head, Link, router } from '@inertiajs/react';
import type { CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ConditionBadge } from '@/components/condition-badge';
import {
    Trash2,
    Minus,
    Plus,
    ShoppingBag,
    ArrowRight,
    PackageOpen,
} from 'lucide-react';

type Props = {
    cartItems: CartItemType[];
};

export default function CartPage({ cartItems }: Props) {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.product?.price ?? 0) * item.quantity;
    }, 0);

    const shippingEstimate = cartItems.length > 0 ? 15000 : 0;
    const total = subtotal + shippingEstimate;

    function updateQuantity(cartItemId: number, quantity: number) {
        router.put(
            `/cart/${cartItemId}`,
            { quantity },
            { preserveScroll: true },
        );
    }

    function removeItem(cartItemId: number) {
        router.delete(`/cart/${cartItemId}`, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Shopping Cart" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                <h1 className="text-2xl md:text-3xl font-bold font-heading tracking-tight mb-8">
                    Shopping Cart
                </h1>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex gap-4 p-4">
                                            {/* Product Image */}
                                            <Link
                                                href={`/products/${item.product?.id}`}
                                                className="shrink-0"
                                            >
                                                <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden bg-muted">
                                                    <img
                                                        src={
                                                            item.product?.images?.[0]
                                                                ?.image_url ??
                                                            'https://placehold.co/200x250/e2e8f0/475569?text=No+Image'
                                                        }
                                                        alt={item.product?.name}
                                                        className="h-full w-full object-cover hover:scale-105 transition-transform"
                                                    />
                                                </div>
                                            </Link>

                                            {/* Item Details */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <Link
                                                        href={`/products/${item.product?.id}`}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                                                            {item.product?.name}
                                                        </h3>
                                                    </Link>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                        {item.product?.condition && (
                                                            <ConditionBadge
                                                                condition={item.product.condition}
                                                            />
                                                        )}
                                                        {item.size && (
                                                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                                Size: {item.size}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.product?.seller && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Sold by{' '}
                                                            {item.product.seller.name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center border border-input rounded-md">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    Math.max(1, item.quantity - 1),
                                                                )
                                                            }
                                                            className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-l-md transition-colors"
                                                        >
                                                            <Minus className="h-3.5 w-3.5" />
                                                        </button>
                                                        <span className="h-8 w-10 flex items-center justify-center text-sm font-medium border-x border-input">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity + 1,
                                                                )
                                                            }
                                                            className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-r-md transition-colors"
                                                        >
                                                            <Plus className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>

                                                    {/* Price & Remove */}
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-bold text-sm sm:text-base">
                                                            {formatPrice(
                                                                (item.product?.price ??
                                                                    0) *
                                                                    item.quantity,
                                                            )}
                                                        </p>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                            onClick={() =>
                                                                removeItem(item.id)
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-32">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal (
                                            {cartItems.reduce(
                                                (sum, i) => sum + i.quantity,
                                                0,
                                            )}{' '}
                                            items)
                                        </span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Shipping estimate
                                        </span>
                                        <span>{formatPrice(shippingEstimate)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-base">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            {formatPrice(total)}
                                        </span>
                                    </div>

                                    <Button
                                        className="w-full rounded-lg font-semibold text-base"
                                        size="lg"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>

                                    <Link
                                        href="/search"
                                        className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ShoppingBag className="h-4 w-4 mr-1.5" />
                                        Continue Shopping
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    /* Empty cart */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <PackageOpen className="h-20 w-20 text-muted-foreground/20 mb-6" />
                        <h2 className="text-xl font-semibold mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-sm">
                            Looks like you haven't added any items yet. Discover
                            unique pre-loved fashion pieces!
                        </p>
                        <Link href="/search">
                            <Button
                                size="lg"
                                className="rounded-full px-8 font-semibold"
                            >
                                <ShoppingBag className="h-5 w-5 mr-2" />
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
