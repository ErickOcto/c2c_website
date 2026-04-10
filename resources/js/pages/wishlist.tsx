import { Head, Link } from '@inertiajs/react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product-card';
import { HeartCrack, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

type WishlistProps = {
    wishlists: {
        data: {
            id: number;
            product: Product;
        }[];
        current_page: number;
        last_page: number;
        links: any[];
    };
};

export default function WishlistPage({ wishlists }: WishlistProps) {
    const items = wishlists.data;

    return (
        <>
            <Head title="My Wishlist" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                <h1 className="text-2xl md:text-3xl font-bold font-heading tracking-tight mb-8">
                    My Wishlist
                </h1>

                {items.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {items.map((item) => (
                            <ProductCard
                                key={item.product.id}
                                product={{ ...item.product, is_wishlisted: true }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <HeartCrack className="h-20 w-20 text-muted-foreground/20 mb-6" />
                        <h2 className="text-xl font-semibold mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-sm">
                            Save products you like to your wishlist to keep track of them and buy them later!
                        </p>
                        <Link href="/search">
                            <Button
                                size="lg"
                                className="rounded-full px-8 font-semibold"
                            >
                                <ShoppingBag className="h-5 w-5 mr-2" />
                                Start Exploring
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

// Ensure default layout behavior if not explicitly handled by StorefrontLayout
// but assuming StorefrontLayout handles the navbar and footer.
