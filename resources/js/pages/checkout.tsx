import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type {
    CartItemType,
    SellerGroup,
    ShippingCourierResult,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

declare global {
    interface Window {
        snap?: any;
    }
}

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    MapPin,
    Truck,
    ShieldCheck,
    Loader2,
    Store,
    CreditCard,
    ArrowLeft,
    Pencil,
} from 'lucide-react';

type ProfileData = {
    id?: number;
    phone?: string;
    address?: string;
    city?: string;
    city_id?: number;
    province_id?: number;
    province_name?: string;
    postal_code?: string;
};

type Props = {
    sellerGroups: SellerGroup[];
    profile: ProfileData | null;
    couriers: string[];
    midtransClientKey: string;
};

type SelectedShipping = {
    courier: string;
    service: string;
    cost: number;
    etd: string;
};

type ShippingState = {
    [sellerId: number]: {
        loading: boolean;
        results: ShippingCourierResult[];
        selected: SelectedShipping | null;
    };
};

export default function CheckoutPage({
    sellerGroups,
    profile,
    couriers,
    midtransClientKey,
}: Props) {
    const [shippingState, setShippingState] = useState<ShippingState>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const hasAddress = !!(profile?.address && profile?.city && profile?.city_id);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    // Calculate shipping for a seller group
    const fetchShipping = useCallback(
        async (sellerId: number, courier: string) => {
            if (!hasAddress) {
                toast.error(
                    'Please complete your address in profile settings first.',
                );
                return;
            }

            const group = sellerGroups.find((g) => g.seller_id === sellerId);
            const weight =
                group?.items.reduce(
                    (sum, item) => sum + item.quantity * 300,
                    0,
                ) ?? 300;

            setShippingState((prev) => ({
                ...prev,
                [sellerId]: {
                    ...prev[sellerId],
                    loading: true,
                    selected: null,
                },
            }));

            try {
                const response = await fetch('/checkout/shipping', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': decodeURIComponent(
                            document.cookie
                                .split('; ')
                                .find((row) => row.startsWith('XSRF-TOKEN='))
                                ?.split('=')[1] ?? '',
                        ),
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        seller_id: sellerId,
                        courier,
                        weight,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    const errorMsg =
                        data.error ||
                        data.message ||
                        (data.errors
                            ? Object.values(data.errors).flat().join(', ')
                            : 'Failed to calculate shipping.');
                    toast.error(errorMsg);
                    setShippingState((prev) => ({
                        ...prev,
                        [sellerId]: {
                            ...prev[sellerId],
                            loading: false,
                        },
                    }));
                    return;
                }

                setShippingState((prev) => ({
                    ...prev,
                    [sellerId]: {
                        loading: false,
                        results: data.results ?? [],
                        selected: null,
                    },
                }));
            } catch {
                toast.error('Network error while fetching shipping rates.');
                setShippingState((prev) => ({
                    ...prev,
                    [sellerId]: { ...prev[sellerId], loading: false },
                }));
            }
        },
        [hasAddress, sellerGroups],
    );

    // Select a shipping service
    const selectShipping = (
        sellerId: number,
        courier: string,
        service: string,
        cost: number,
        etd: string,
    ) => {
        setShippingState((prev) => ({
            ...prev,
            [sellerId]: {
                ...prev[sellerId],
                selected: { courier, service, cost, etd },
            },
        }));
    };

    // Calculate totals
    const itemsSubtotal = sellerGroups.reduce(
        (sum, group) => sum + group.subtotal,
        0,
    );
    const totalShipping = Object.values(shippingState).reduce(
        (sum, state) => sum + (state.selected?.cost ?? 0),
        0,
    );
    const grandTotal = itemsSubtotal + totalShipping;

    // Check if all sellers have shipping selected
    const allShippingSelected = sellerGroups.every(
        (group) => shippingState[group.seller_id]?.selected,
    );

    // Process checkout
    const processCheckout = async () => {
        if (!hasAddress) {
            toast.error('Please complete your address in profile settings.');
            return;
        }
        if (!allShippingSelected) {
            toast.error('Please select shipping for all sellers.');
            return;
        }

        setIsProcessing(true);

        try {
            const sellerShipments = sellerGroups.map((group) => {
                const shipping = shippingState[group.seller_id].selected!;
                return {
                    seller_id: group.seller_id,
                    courier: shipping.courier,
                    service: shipping.service,
                    cost: shipping.cost,
                    etd: shipping.etd,
                };
            });

            const response = await fetch('/checkout/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(
                        document.cookie
                            .split('; ')
                            .find((row) => row.startsWith('XSRF-TOKEN='))
                            ?.split('=')[1] ?? '',
                    ),
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    seller_shipments: sellerShipments,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || 'Checkout failed.');
                setIsProcessing(false);
                return;
            }

            // Launch Midtrans Snap popup
            if (data.snap_token && window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: async () => {
                        try {
                            await fetch('/checkout/confirm-payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-XSRF-TOKEN': decodeURIComponent(
                                        document.cookie
                                            .split('; ')
                                            .find((row) =>
                                                row.startsWith('XSRF-TOKEN='),
                                            )
                                            ?.split('=')[1] ?? '',
                                    ),
                                    Accept: 'application/json',
                                },
                                body: JSON.stringify({
                                    transaction_id: data.transaction_id,
                                }),
                            });
                        } catch {
                            // Silently fail — webhook will catch it eventually
                        }
                        toast.success('Payment successful!');
                        router.visit('/dashboard');
                    },
                    onPending: () => {
                        toast.info(
                            'Payment pending. Please complete your payment.',
                        );
                        router.visit('/dashboard');
                    },
                    onError: () => {
                        toast.error('Payment failed. Please try again.');
                        setIsProcessing(false);
                    },
                    onClose: () => {
                        toast.info(
                            'Payment window closed. Your order is still pending.',
                        );
                        setIsProcessing(false);
                    },
                });
            } else {
                toast.error(
                    'Payment service is not available. Please try again later.',
                );
                setIsProcessing(false);
            }
        } catch {
            toast.error('Network error. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Head title="Checkout" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/cart"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold font-heading tracking-tight">
                        Checkout
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address (from Profile) */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-base">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Shipping Address
                                    </div>
                                    <Link
                                        href="/settings/profile"
                                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-normal"
                                    >
                                        <Pencil className="h-3 w-3" />
                                        Edit
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {hasAddress ? (
                                    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-1">
                                        <p className="font-semibold text-sm">
                                            {profile?.address}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {profile?.city}
                                            {profile?.province_name &&
                                                `, ${profile.province_name}`}
                                            {profile?.postal_code &&
                                                ` ${profile.postal_code}`}
                                        </p>
                                        {profile?.phone && (
                                            <p className="text-sm text-muted-foreground">
                                                {profile.phone}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <MapPin className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Please complete your address in
                                            profile settings to continue.
                                        </p>
                                        <Link href="/settings/profile">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                            >
                                                Go to Settings
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Seller Groups */}
                        {sellerGroups.map((group) => {
                            const sellerShipping =
                                shippingState[group.seller_id];

                            return (
                                <Card key={group.seller_id}>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center justify-between text-base">
                                            <div className="flex items-center gap-2">
                                                <Store className="h-4 w-4 text-primary" />
                                                <span>
                                                    {group.seller_name}
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground font-normal">
                                                {group.seller_city}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Items */}
                                        {group.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-3"
                                            >
                                                <div className="w-14 h-18 rounded-md overflow-hidden bg-muted shrink-0">
                                                    <img
                                                        src={
                                                            item.product
                                                                ?.images?.[0]
                                                                ?.image_url ??
                                                            'https://placehold.co/100x120/e2e8f0/475569?text=No+Image'
                                                        }
                                                        alt={
                                                            item.product?.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium line-clamp-1">
                                                        {item.product?.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        Qty: {item.quantity}
                                                        {item.size &&
                                                            ` · Size: ${item.size}`}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-semibold shrink-0">
                                                    {formatPrice(
                                                        (item.product?.price ??
                                                            0) * item.quantity,
                                                    )}
                                                </p>
                                            </div>
                                        ))}

                                        <Separator />

                                        {/* Shipping Selection */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Truck className="h-4 w-4 text-muted-foreground" />
                                                Shipping Option
                                            </div>

                                            {/* Courier selector */}
                                            <div className="flex gap-2 flex-wrap">
                                                {couriers.map((courier) => (
                                                    <Button
                                                        key={courier}
                                                        variant={
                                                            sellerShipping?.selected
                                                                ?.courier ===
                                                            courier
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        size="sm"
                                                        disabled={
                                                            !hasAddress ||
                                                            sellerShipping?.loading
                                                        }
                                                        onClick={() =>
                                                            fetchShipping(
                                                                group.seller_id,
                                                                courier,
                                                            )
                                                        }
                                                        className="uppercase text-xs font-bold"
                                                    >
                                                        {courier}
                                                    </Button>
                                                ))}
                                            </div>

                                            {/* Loading state */}
                                            {sellerShipping?.loading && (
                                                <div className="space-y-2">
                                                    <Skeleton className="h-12 w-full" />
                                                    <Skeleton className="h-12 w-full" />
                                                </div>
                                            )}

                                            {/* Service options */}
                                            {sellerShipping?.results &&
                                                !sellerShipping.loading && (
                                                    <div className="space-y-2">
                                                        {sellerShipping.results
                                                            .length === 0 && (
                                                            <p className="text-xs text-muted-foreground">
                                                                No shipping
                                                                options
                                                                available for
                                                                this courier.
                                                            </p>
                                                        )}
                                                        {sellerShipping.results.map(
                                                            (
                                                                courierResult,
                                                            ) =>
                                                                courierResult.costs.map(
                                                                    (
                                                                        svc,
                                                                    ) => {
                                                                        const cost =
                                                                            svc
                                                                                .cost[0]
                                                                                ?.value ??
                                                                            0;
                                                                        const etd =
                                                                            svc
                                                                                .cost[0]
                                                                                ?.etd ??
                                                                            '-';
                                                                        const isSelected =
                                                                            sellerShipping
                                                                                .selected
                                                                                ?.service ===
                                                                                svc.service &&
                                                                            sellerShipping
                                                                                .selected
                                                                                ?.courier ===
                                                                                courierResult.code;

                                                                        return (
                                                                            <button
                                                                                key={`${courierResult.code}-${svc.service}`}
                                                                                onClick={() =>
                                                                                    selectShipping(
                                                                                        group.seller_id,
                                                                                        courierResult.code,
                                                                                        svc.service,
                                                                                        cost,
                                                                                        etd,
                                                                                    )
                                                                                }
                                                                                className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                                                                                    isSelected
                                                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                                                                        : 'border-border hover:border-muted-foreground/30'
                                                                                }`}
                                                                            >
                                                                                <div>
                                                                                    <p className="text-sm font-medium">
                                                                                        {courierResult.code.toUpperCase()}{' '}
                                                                                        {
                                                                                            svc.service
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {
                                                                                            svc.description
                                                                                        }{' '}
                                                                                        ·
                                                                                        Est.{' '}
                                                                                        {
                                                                                            etd
                                                                                        }{' '}
                                                                                        days
                                                                                    </p>
                                                                                </div>
                                                                                <p className="text-sm font-bold">
                                                                                    {formatPrice(
                                                                                        cost,
                                                                                    )}
                                                                                </p>
                                                                            </button>
                                                                        );
                                                                    },
                                                                ),
                                                        )}
                                                    </div>
                                                )}
                                        </div>

                                        {/* Group subtotal */}
                                        <div className="flex justify-between text-sm pt-2">
                                            <span className="text-muted-foreground">
                                                Items subtotal
                                            </span>
                                            <span className="font-medium">
                                                {formatPrice(group.subtotal)}
                                            </span>
                                        </div>
                                        {sellerShipping?.selected && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Shipping (
                                                    {sellerShipping.selected.courier.toUpperCase()}{' '}
                                                    {
                                                        sellerShipping.selected
                                                            .service
                                                    }
                                                    )
                                                </span>
                                                <span className="font-medium">
                                                    {formatPrice(
                                                        sellerShipping.selected
                                                            .cost,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-32">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Items (
                                        {sellerGroups.reduce(
                                            (sum, g) =>
                                                sum +
                                                g.items.reduce(
                                                    (s, i) => s + i.quantity,
                                                    0,
                                                ),
                                            0,
                                        )}
                                        )
                                    </span>
                                    <span>{formatPrice(itemsSubtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Shipping
                                    </span>
                                    <span>
                                        {allShippingSelected
                                            ? formatPrice(totalShipping)
                                            : '—'}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-base">
                                    <span>Grand Total</span>
                                    <span className="text-primary">
                                        {allShippingSelected
                                            ? formatPrice(grandTotal)
                                            : '—'}
                                    </span>
                                </div>

                                <Button
                                    id="pay-now-button"
                                    className="w-full rounded-lg font-semibold text-base"
                                    size="lg"
                                    disabled={
                                        !allShippingSelected ||
                                        !hasAddress ||
                                        isProcessing
                                    }
                                    onClick={processCheckout}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="mr-2 h-5 w-5" />
                                            Pay Now
                                        </>
                                    )}
                                </Button>

                                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
                                    <p>
                                        Your payment is secured by Midtrans.
                                        We support credit cards, bank
                                        transfers, e-wallets, and more.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
