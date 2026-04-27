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
    Recycle,
    Users,
    Star,
    ChevronRight,
    Leaf,
    BadgeCheck,
    Zap,
} from 'lucide-react';

type Props = {
    categories: Category[];
    featuredProducts: Product[];
    cartItemCount: number;
    canRegister: boolean;
};

const categoryIcons: Record<string, React.ReactNode> = {
    shirt: <Shirt className="h-5 w-5" />,
    pants: <Scissors className="h-5 w-5" />,
    dress: <Gem className="h-5 w-5" />,
    jacket: <ShoppingBag className="h-5 w-5" />,
    shoe: <TrendingUp className="h-5 w-5" />,
    bag: <ShoppingBag className="h-5 w-5" />,
    accessory: <Gem className="h-5 w-5" />,
    activewear: <Sparkles className="h-5 w-5" />,
};

const stats = [
    { value: '10K+', label: 'Happy Buyers', icon: <Users className="h-4 w-4" /> },
    { value: '25K+', label: 'Items Listed', icon: <ShoppingBag className="h-4 w-4" /> },
    { value: '4.9', label: 'Avg Rating', icon: <Star className="h-4 w-4 fill-current" /> },
    { value: '99%', label: 'Satisfaction', icon: <BadgeCheck className="h-4 w-4" /> },
];

export default function Welcome({
    categories = [],
    featuredProducts = [],
}: Props) {
    return (
        <>
            <Head title="Home — Pre-Loved Fashion Marketplace" />

            {/* ── Hero Section ── */}
            <section className="relative overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-50 dark:from-emerald-950/40 dark:via-background dark:to-teal-950/30" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 dark:from-emerald-500/10" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left: Copy */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
                                <Leaf className="h-4 w-4" />
                                Sustainable Fashion Marketplace
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading tracking-tight text-foreground leading-[1.1]">
                                Give Fashion a{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-teal-500">
                                    Second Life
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                                Discover unique pre-loved fashion pieces at amazing prices.
                                Buy and sell with confidence in Indonesia's most trusted
                                second-hand fashion community.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/search">
                                    <Button
                                        size="lg"
                                        className="rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all h-12"
                                    >
                                        Start Shopping
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="rounded-full px-8 text-base font-semibold hover:scale-[1.02] transition-all h-12"
                                    >
                                        Sell Your Closet
                                    </Button>
                                </Link>
                            </div>

                            {/* Social proof stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-primary mb-0.5">
                                            {stat.icon}
                                            <span className="text-xl font-bold text-foreground">
                                                {stat.value}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Visual element — card mosaic */}
                        <div className="hidden lg:block relative">
                            <div className="relative w-full aspect-square max-w-lg mx-auto">
                                {/* Decorative ring */}
                                <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary/15 animate-[spin_60s_linear_infinite]" />

                                {/* Center badge */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-2xl shadow-primary/30">
                                        <Recycle className="h-12 w-12 text-white" />
                                    </div>
                                </div>

                                {/* Floating feature cards */}
                                {[
                                    { label: 'Verified Sellers', icon: <BadgeCheck className="h-5 w-5" />, pos: 'top-0 left-1/2 -translate-x-1/2', delay: '0s' },
                                    { label: 'Free Shipping', icon: <Truck className="h-5 w-5" />, pos: 'top-1/2 right-0 -translate-y-1/2', delay: '0.2s' },
                                    { label: 'Buyer Protection', icon: <Shield className="h-5 w-5" />, pos: 'bottom-0 left-1/2 -translate-x-1/2', delay: '0.4s' },
                                    { label: 'Eco Friendly', icon: <Leaf className="h-5 w-5" />, pos: 'top-1/2 left-0 -translate-y-1/2', delay: '0.6s' },
                                ].map((card) => (
                                    <div
                                        key={card.label}
                                        className={`absolute ${card.pos} animate-in fade-in slide-in-from-bottom-2 duration-700`}
                                        style={{ animationDelay: card.delay }}
                                    >
                                        <div className="flex items-center gap-2.5 bg-background/90 backdrop-blur-xl border border-border/60 rounded-full px-4 py-2.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                {card.icon}
                                            </div>
                                            <span className="text-sm font-semibold whitespace-nowrap pr-1">
                                                {card.label}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Categories ── */}
            <section className="py-16 md:py-20 bg-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight mb-2">
                                Shop by Category
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base">
                                Find exactly what you're looking for
                            </p>
                        </div>
                        <Link
                            href="/search"
                            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            Browse All <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/search?category=${category.id}`}
                                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-b from-card to-muted/30 border border-border/40 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5"
                            >
                                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-primary/20">
                                    {categoryIcons[category.icon ?? 'shirt'] ?? (
                                        <ShoppingBag className="h-5 w-5" />
                                    )}
                                </div>
                                <span className="text-xs md:text-sm font-semibold text-center leading-tight">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Products ── */}
            <section className="py-16 md:py-20 bg-gradient-to-b from-muted/30 via-muted/20 to-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold mb-2">
                                <Zap className="h-4 w-4" />
                                Just Dropped
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight">
                                Fresh Arrivals
                            </h2>
                        </div>
                        <Link href="/search">
                            <Button
                                variant="outline"
                                className="rounded-full hidden sm:flex hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    {featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-border">
                            <ShoppingBag className="h-14 w-14 mx-auto mb-4 text-muted-foreground/30" />
                            <p className="text-muted-foreground font-medium">
                                No products listed yet. Be the first to sell!
                            </p>
                            <Link href="/register">
                                <Button className="mt-4 rounded-full">
                                    Start Selling <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
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

            {/* ── How It Works ── */}
            <section className="py-20 md:py-28 bg-background relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-full blur-3xl" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold mb-3">
                            <Sparkles className="h-4 w-4" />
                            Simple & Easy
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-4">
                            How It Works
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Three simple steps to buy or sell pre-loved fashion
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            {
                                icon: <Sparkles className="h-7 w-7" />,
                                title: 'List Your Items',
                                description:
                                    'Snap photos, set your price, and list your pre-loved fashion items in minutes.',
                                gradient: 'from-violet-500/10 to-purple-500/10',
                                iconBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
                                ring: 'ring-violet-500/20',
                            },
                            {
                                icon: <ShoppingBag className="h-7 w-7" />,
                                title: 'Shop & Discover',
                                description:
                                    'Browse thousands of unique pieces from verified sellers across Indonesia.',
                                gradient: 'from-primary/10 to-emerald-500/10',
                                iconBg: 'bg-primary/10 text-primary',
                                ring: 'ring-primary/20',
                            },
                            {
                                icon: <Truck className="h-7 w-7" />,
                                title: 'Ship & Enjoy',
                                description:
                                    'Secure payment, reliable shipping, and buyer protection on every order.',
                                gradient: 'from-amber-500/10 to-orange-500/10',
                                iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                                ring: 'ring-amber-500/20',
                            },
                        ].map((step, index) => (
                            <div
                                key={index}
                                className={`group relative flex flex-col items-center text-center p-8 md:p-10 rounded-3xl bg-gradient-to-b ${step.gradient} border border-border/50 hover:border-border hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 hover:-translate-y-2`}
                            >
                                {/* Step number */}
                                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/30 ring-4 ${step.ring} ring-offset-2 ring-offset-background`}>
                                    {index + 1}
                                </div>
                                {/* Icon */}
                                <div className={`flex items-center justify-center h-16 w-16 rounded-2xl ${step.iconBg} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {step.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-3">
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

            {/* ── CTA Banner ── */}
            <section className="py-20 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-600 to-teal-600" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-medium text-white/90 mb-6">
                        <Recycle className="h-4 w-4" />
                        Join the Movement
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-white mb-6 leading-tight">
                        Your Closet Has Value.{' '}
                        <br className="hidden sm:block" />
                        Start Earning Today.
                    </h2>
                    <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Turn your unused fashion into cash. Join thousands of sellers who
                        are already making money while promoting sustainable fashion.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/register">
                            <Button
                                size="lg"
                                className="rounded-full px-10 text-base font-semibold bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all h-12"
                            >
                                Start Selling Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full px-10 text-base font-semibold border-white/30 text-white hover:bg-white/10 transition-all h-12"
                            >
                                Browse Items
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Trust Badges ── */}
            <section className="py-14 md:py-16 bg-background border-t border-border/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Shield className="h-7 w-7" />,
                                title: 'Buyer Protection',
                                desc: 'Full refund if item is not as described. Shop with zero risk.',
                                color: 'text-blue-500 bg-blue-500/10',
                            },
                            {
                                icon: <Truck className="h-7 w-7" />,
                                title: 'Tracked Shipping',
                                desc: 'Real-time tracking on every order. Know where your package is.',
                                color: 'text-purple-500 bg-purple-500/10',
                            },
                            {
                                icon: <BadgeCheck className="h-7 w-7" />,
                                title: 'Verified Community',
                                desc: 'Every seller is verified. Authentic items guaranteed.',
                                color: 'text-emerald-500 bg-emerald-500/10',
                            },
                        ].map((badge, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-6 rounded-2xl hover:bg-muted/50 transition-colors"
                            >
                                <div className={`shrink-0 h-12 w-12 rounded-xl ${badge.color} flex items-center justify-center`}>
                                    {badge.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">
                                        {badge.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {badge.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
