import { useEffect, useRef, useState, useCallback } from 'react';
import type { LinkedProduct } from '@/types';
import { Search, X, Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (product: LinkedProduct) => void;
    sellerId?: number;
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);

export function ProductPickerModal({ isOpen, onClose, onSelect, sellerId }: Props) {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<LinkedProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchProducts = useCallback(
        async (q: string) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ q });
                if (sellerId) {
                    params.set('seller_id', String(sellerId));
                }
                const res = await fetch(`/chat/products/search?${params.toString()}`, {
                    headers: { Accept: 'application/json' },
                });
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products ?? []);
                }
            } catch {
                // Silently fail
            } finally {
                setLoading(false);
            }
        },
        [sellerId],
    );

    // Fetch on open
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setProducts([]);
            fetchProducts('');
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isOpen, fetchProducts]);

    // Debounced search
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            fetchProducts(query);
        }, 350);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, isOpen, fetchProducts]);

    if (!isOpen) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel — slides up from bottom on mobile, centered modal on desktop */}
            <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-card shadow-2xl ring-1 ring-border/50 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold">Attach Product</h3>
                        <p className="text-[11px] text-muted-foreground">
                            Send a product reference with your message
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Search */}
                <div className="px-4 pt-3 pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products..."
                            className="h-10 w-full rounded-xl border border-input bg-muted/50 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                    </div>
                </div>

                {/* Product List */}
                <div className="max-h-72 overflow-y-auto px-2 pb-4">
                    {loading ? (
                        <div className="space-y-2 p-2">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex animate-pulse items-center gap-3 rounded-xl p-2"
                                >
                                    <div className="h-14 w-14 shrink-0 rounded-xl bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-3/4 rounded bg-muted" />
                                        <div className="h-3 w-1/3 rounded bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                                <Package className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {query ? 'No products found' : 'No products available'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1 p-1">
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => {
                                        onSelect(product);
                                        onClose();
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all hover:bg-accent/70 active:scale-[0.98]"
                                >
                                    {/* Product Image */}
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package className="h-5 w-5 text-muted-foreground/40" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium leading-tight">
                                            {product.name}
                                        </p>
                                        <p className="mt-0.5 text-sm font-bold text-primary">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>

                                    {/* Chevron hint */}
                                    <div className="shrink-0 text-muted-foreground/50 text-xs">
                                        Attach →
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
