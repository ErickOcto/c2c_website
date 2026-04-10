import type { LinkedProduct } from '@/types';
import { Link } from '@inertiajs/react';

type Props = {
    product: LinkedProduct;
    isMine: boolean;
};

export function ProductContextCard({ product, isMine }: Props) {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    return (
        <Link
            href={`/products/${product.id}`}
            className={`flex items-center gap-3 rounded-xl border p-2.5 transition-all hover:shadow-md ${
                isMine
                    ? 'border-primary-foreground/20 bg-primary/80'
                    : 'border-border bg-background hover:bg-accent/30'
            }`}
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
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No img
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="min-w-0 flex-1">
                <p
                    className={`truncate text-xs font-semibold ${
                        isMine ? 'text-primary-foreground' : 'text-foreground'
                    }`}
                >
                    {product.name}
                </p>
                <p
                    className={`text-xs font-bold mt-0.5 ${
                        isMine
                            ? 'text-primary-foreground/90'
                            : 'text-primary'
                    }`}
                >
                    {formatPrice(product.price)}
                </p>
            </div>
        </Link>
    );
}
