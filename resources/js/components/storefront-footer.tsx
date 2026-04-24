import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

export function StorefrontFooter() {
    return (
        <footer className="bg-card border-t border-border mt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="text-xl font-bold font-heading tracking-tight flex items-center gap-2"
                        >
                            <AppLogoIcon className="size-9 fill-current text-primary dark:text-white" /> C2C
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Give your pre-loved fashion a second life.
                            Buy and sell quality second-hand clothing with
                            confidence.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Shop</h3>
                        <ul className="space-y-2.5">
                            {['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Bags'].map((cat) => (
                                <li key={cat}>
                                    <Link
                                        href={`/search?category=${cat.toLowerCase()}`}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Company</h3>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'About Us', href: '#' },
                                { label: 'Careers', href: '#' },
                                { label: 'Press', href: '#' },
                                { label: 'Blog', href: '#' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Support</h3>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Help Center', href: '#' },
                                { label: 'Safety Center', href: '#' },
                                { label: 'Selling Guide', href: '#' },
                                { label: 'Buying Guide', href: '#' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} C2C. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> for sustainable fashion
                    </p>
                </div>
            </div>
        </footer>
    );
}
