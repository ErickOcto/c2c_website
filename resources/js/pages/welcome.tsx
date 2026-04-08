import { Head, Link } from '@inertiajs/react';
import type { Product, Category } from '@/types';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import {
    Shirt,
    Scissors,
    Gem,
    ShoppingBag,
    Truck,
    Shield,
    ArrowRight,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

type Props = {
    categories: Category[];
    featuredProducts: Product[];
    cartItemCount: number;
    canRegister: boolean;
};

const categoryIcons: Record<string, React.ReactNode> = {
    shirt: <Shirt className="h-6 w-6" />,
    pants: <Scissors className="h-6 w-6" />,
    dress: <Gem className="h-6 w-6" />,
    jacket: <ShoppingBag className="h-6 w-6" />,
    shoe: <TrendingUp className="h-6 w-6" />,
    bag: <ShoppingBag className="h-6 w-6" />,
    accessory: <Gem className="h-6 w-6" />,
    activewear: <Sparkles className="h-6 w-6" />,
};

export default function Welcome({
    categories = [],
    featuredProducts = [],
}: Props) {
    return (
        <>
            <Head title="Home — Pre-Loved Fashion Marketplace" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50 dark:opacity-20" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                            <Sparkles className="h-4 w-4" />
                            Sustainable Fashion Marketplace
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-foreground mb-6 leading-tight">
                            Give Fashion a{' '}
                            <span className="text-primary">
                                Second Life
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
                            Discover unique pre-loved fashion pieces at amazing prices.
                            Buy and sell with confidence in our trusted community.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/search">
                                <Button size="lg" className="rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                                    Shop Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full px-8 text-base font-semibold"
                                >
                                    Start Selling
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight mb-3">
                            Shop by Category
                        </h2>
                        <p className="text-muted-foreground">
                            Find exactly what you're looking for
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/search?category=${category.id}`}
                                className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    {categoryIcons[category.icon ?? 'shirt'] ?? (
                                        <ShoppingBag className="h-6 w-6" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-center">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight mb-2">
                                Fresh Arrivals
                            </h2>
                            <p className="text-muted-foreground">
                                Recently listed pre-loved pieces
                            </p>
                        </div>
                        <Link href="/search">
                            <Button
                                variant="outline"
                                className="rounded-full hidden sm:flex"
                            >
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    {featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p>No products listed yet. Be the first to sell!</p>
                        </div>
                    )}
                    <div className="text-center mt-8 sm:hidden">
                        <Link href="/search">
                            <Button variant="outline" className="rounded-full">
                                View All Products
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 bg-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight mb-3">
                            How It Works
                        </h2>
                        <p className="text-muted-foreground">
                            Simple steps to buy or sell pre-loved fashion
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Sparkles className="h-7 w-7" />,
                                title: 'List Your Items',
                                description:
                                    'Take photos, set your price, and list your pre-loved fashion items in minutes.',
                            },
                            {
                                icon: <ShoppingBag className="h-7 w-7" />,
                                title: 'Shop & Discover',
                                description:
                                    'Browse thousands of unique pieces from verified sellers. Find your perfect match.',
                            },
                            {
                                icon: <Truck className="h-7 w-7" />,
                                title: 'Ship & Enjoy',
                                description:
                                    'Secure payment, reliable shipping, and buyer protection on every order.',
                            },
                        ].map((step, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mb-5">
                                    {step.icon}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust badges */}
            <section className="py-12 bg-muted/30 border-t border-border/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        {[
                            {
                                icon: <Shield className="h-6 w-6" />,
                                title: 'Buyer Protection',
                                desc: 'Full refund if item not as described',
                            },
                            {
                                icon: <Truck className="h-6 w-6" />,
                                title: 'Secure Shipping',
                                desc: 'Track your order every step of the way',
                            },
                            {
                                icon: <Sparkles className="h-6 w-6" />,
                                title: 'Verified Sellers',
                                desc: 'All sellers go through our verification process',
                            },
                        ].map((badge, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center gap-2 p-4"
                            >
                                <div className="text-primary">{badge.icon}</div>
                                <h4 className="font-semibold text-sm">
                                    {badge.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {badge.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
