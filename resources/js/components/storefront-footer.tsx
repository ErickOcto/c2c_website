import { Link } from '@inertiajs/react';
import { Heart, Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';
import { Button } from '@/components/ui/button';

const footerLinks = {
    shop: [
        { label: 'New Arrivals', href: '/search?sort=newest' },
        { label: 'Trending', href: '/search?sort=popular' },
        { label: 'Women', href: '/search?department=women' },
        { label: 'Men', href: '/search?department=men' },
        { label: 'Kids', href: '/search?department=kids' },
    ],
    company: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Sustainability', href: '#' },
    ],
    support: [
        { label: 'Help Center', href: '#' },
        { label: 'Seller Guide', href: '#' },
        { label: 'Buyer Guide', href: '#' },
        { label: 'Safety Tips', href: '#' },
    ],
};

const socials = [
    { icon: <Instagram className="h-4 w-4" />, href: '#', label: 'Instagram' },
    { icon: <Twitter className="h-4 w-4" />, href: '#', label: 'Twitter' },
    { icon: <Youtube className="h-4 w-4" />, href: '#', label: 'YouTube' },
];

export function StorefrontFooter() {
    return (
        <footer className="bg-card border-t border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Newsletter */}
                <div className="py-10 md:py-12 border-b border-border/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-bold font-heading tracking-tight mb-1">
                                Stay in the Loop
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Get notified about new arrivals, sales, and style tips.
                            </p>
                        </div>
                        <div className="flex w-full max-w-sm gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-10 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <Button className="rounded-full px-6 shrink-0">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Links grid */}
                <div className="py-10 md:py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-1 space-y-4">
                        <Link
                            href="/"
                            className="text-xl font-bold font-heading tracking-tight flex items-center gap-2"
                        >
                            <AppLogoIcon className="size-8 fill-current text-primary dark:text-white" />
                            C2C
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Indonesia's trusted pre-loved fashion marketplace.
                            Buy, sell, and discover sustainable style.
                        </p>
                        <div className="flex items-center gap-2">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="h-9 w-9 rounded-full bg-muted/60 hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all duration-200"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-sm mb-4 capitalize">
                                {title}
                            </h4>
                            <ul className="space-y-2.5">
                                {links.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} C2C Marketplace. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        Made with{' '}
                        <Heart className="h-3 w-3 fill-red-500 text-red-500 animate-pulse" />{' '}
                        for sustainable fashion
                    </p>
                </div>
            </div>
        </footer>
    );
}
