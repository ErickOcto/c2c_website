import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import type { User, Product, PaginatedProducts } from '@/types';
import { ProductCard } from '@/components/product-card';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    MessageCircle,
    UserPlus,
    MapPin,
    PackageOpen,
} from 'lucide-react';

type Props = {
    seller: User;
    products: PaginatedProducts;
};

export default function ShopShow({ seller, products }: Props) {
    const [allProducts, setAllProducts] = useState<Product[]>(products.data);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Sync products from Inertia props to local state
    useEffect(() => {
        if (products.current_page === 1) {
            setAllProducts(products.data);
        } else {
            setAllProducts((prev) => {
                const newProducts = products.data.filter(
                    (p) => !prev.some((existing) => existing.id === p.id)
                );
                return [...prev, ...newProducts];
            });
        }
    }, [products.data, products.current_page]);

    // Intersection Observer for infinite scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    products.next_page_url &&
                    !isLoadingMore
                ) {
                    setIsLoadingMore(true);
                    router.get(
                        products.next_page_url,
                        {},
                        {
                            preserveState: true,
                            preserveScroll: true,
                            only: ['products'],
                            onFinish: () => setIsLoadingMore(false),
                        }
                    );
                }
            },
            { threshold: 0.1, rootMargin: '400px' }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [products.next_page_url, isLoadingMore]);

    return (
        <>
            <Head title={`${seller.name}'s Shop`} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">
                        {seller.name}'s Shop
                    </span>
                </nav>

                {/* Shop Header */}
                <Card className="mb-8 overflow-hidden">
                    {/* Cover Banner (optional placeholder) */}
                    <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 to-primary/5 w-full object-cover relative" />

                    <CardContent className="p-6 sm:p-8 pt-0 relative">
                        <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-12 sm:-mt-16 relative z-10">
                            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background bg-background shadow-sm">
                                <AvatarImage src={seller.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                                    {seller.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-2">
                                <h1 className="text-2xl md:text-3xl font-bold font-heading tracking-tight">
                                    {seller.name}
                                </h1>
                                {seller.profile?.city && (
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {seller.profile.city}
                                        {seller.profile.province_name && `, ${seller.profile.province_name}`}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 pb-1">
                                <Button
                                    className="flex-1 sm:flex-none rounded-full"
                                    onClick={() => {
                                        router.post('/chat', {
                                            receiver_id: seller.id,
                                        });
                                    }}
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Chat
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none rounded-full"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Follow
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold font-heading tracking-tight">
                            Products ({products.total})
                        </h2>
                    </div>

                    {allProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                                {allProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>

                            {/* Infinite Scroll Marker */}
                            {products.next_page_url && (
                                <div ref={loadMoreRef} className="mt-8">
                                    {isLoadingMore && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                                            {Array.from({ length: 6 }, (_, i) => (
                                                <ProductCardSkeleton key={`skeleton-${i}`} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl border-dashed">
                            <PackageOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No products yet
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                                {seller.name} hasn't listed any products for sale at the moment.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
