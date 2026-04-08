import type { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { ConditionBadge } from '@/components/condition-badge';

type Props = {
    product: Product;
};

export function ProductCard({ product }: Props) {
    const averageRating =
        product.reviews && product.reviews.length > 0
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
              product.reviews.length
            : 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Link href={`/products/${product.id}`} className="group block">
            <Card className="overflow-hidden border-0 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-3/4 overflow-hidden bg-muted">
                    <img
                        src={
                            product.images?.[0]?.image_url ??
                            'https://placehold.co/600x800/e2e8f0/475569?text=No+Image'
                        }
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                        <ConditionBadge condition={product.condition} />
                    </div>
                    {product.brand && (
                        <div className="absolute top-3 right-3">
                            <Badge
                                variant="secondary"
                                className="bg-background/80 backdrop-blur-sm text-xs font-medium"
                            >
                                {product.brand}
                            </Badge>
                        </div>
                    )}
                </div>
                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                        {product.category?.name}
                    </p>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="font-bold text-base text-foreground mb-2">
                        {formatPrice(product.price)}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {averageRating > 0 && (
                                <>
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span className="text-xs text-muted-foreground">
                                        {averageRating.toFixed(1)}
                                    </span>
                                </>
                            )}
                        </div>
                        {product.seller && (
                            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                                {product.seller.name}
                            </span>
                        )}
                    </div>
                    {product.size && product.size !== 'One Size' && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Size: {product.size}
                        </p>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
