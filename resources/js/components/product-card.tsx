import type { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Heart, Star } from 'lucide-react';
import { ConditionBadge } from '@/components/condition-badge';
import { router, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import wishlist from '@/routes/wishlist';
import { login } from '@/routes';

type Props = {
    product: Product;
};

export function ProductCard({ product }: Props) {
    const { auth } = usePage().props as any;

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

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.user) {
            router.get(login.url());
            return;
        }

        router.post(wishlist.toggle.url({ product: product.id }), {}, { preserveScroll: true });
    };

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="flex flex-col h-full transition-all duration-300">
                {/* Hero Image Section */}
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/5">
                    <img
                        src={
                            product.images?.[0]?.image_url ??
                            'https://placehold.co/600x800/e2e8f0/475569?text=No+Image'
                        }
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Subtle Overlay for better contrast if needed */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Condition Badge */}
                    <div className="absolute top-2 left-2 z-10">
                        <ConditionBadge 
                            condition={product.condition} 
                            className="backdrop-blur-xl bg-background/50 border-white/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full" 
                        />
                    </div>

                    {/* Wishlist Toggle Overlay */}
                    <button
                        onClick={toggleWishlist}
                        className="absolute top-2 right-2 z-20 h-8 w-8 flex items-center justify-center rounded-full dark:bg-white/20 bg-primary dark:hover:bg-white/40 dark:border-white/30 backdrop-blur-md border border-white/30 transition-all duration-300 active:scale-90 shadow-sm "
                        aria-label="Toggle wishlist"
                    >
                        <Heart
                            className={cn(
                                "h-4 w-4 transition-all duration-500 ease-out",
                                product.is_wishlisted 
                                    ? "fill-white dark:text-primary dark:fill-primary text-white scale-110" 
                                    : "dark:text-black text-white hover:scale-110"
                            )}
                        />
                    </button>
                </div>

                {/* Product Details Section */}
                <CardContent className="px-1 py-6 flex flex-col gap-1.5 overflow-hidden">
                    {/* Title and Pricing Row */}
                    <div className="flex-row items-start justify-between gap-4">
                        <h3 className="mb-1 font-heading font-medium text-xs md:text-sm text-foreground leading-tight line-clamp-2 transition-colors group-hover:text-primary/90">
                            {product.name}
                        </h3>
                        <p className="font-bold text-xs md:text-sm tracking-tight text-foreground whitespace-nowrap">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    {/* Store Name and Rating Row */}
                    <div className="flex items-center gap-1.5 text-muted-foreground/70 text-sm font-medium">
                        <span className="truncate max-w-[140px] hover:text-foreground transition-colors cursor-pointer">
                            {product.seller?.name || 'Anonymous Store'}
                        </span>
                        
                        {averageRating > 0 && (
                            <div className="flex items-center gap-1 ml-0.5">
                                <span className="text-[10px] opacity-50">•</span>
                                <div className="flex items-center gap-0.5">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span className="text-xs font-bold text-foreground/80">
                                        {averageRating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* {product.size && product.size !== 'One Size' && (
                            <div className="flex items-center gap-1 ml-auto">
                                <span className="text-[10px] opacity-50 px-1">|</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter bg-muted px-1.5 py-0.5 rounded">
                                    {product.size}
                                </span>
                            </div>
                        )} */}
                    </div>
                </CardContent>
            </div>
        </Link>
    );
}
