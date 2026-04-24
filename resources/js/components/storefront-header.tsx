import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    ShoppingBag,
    Menu,
    X,
    Heart,
    Bell,
    MessageCircle,
    User,
    LogIn,
    Check} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useInitials } from '@/hooks/use-initials';
import { router } from '@inertiajs/react';
import notifications from '@/routes/notifications';
import AppLogoIcon from './app-logo-icon';

const departments = [
    { name: 'Unisex', slug: 'unisex' },
    { name: 'Men', slug: 'men' },
    { name: 'Women', slug: 'women' },
    { name: 'Kids', slug: 'kids' },
];

export function StorefrontHeader() {
    const { auth, cartItemCount, unreadMessagesCount } = usePage<{
        auth: { 
            user: { id: number; name: string; email: string; avatar?: string } | null;
            unreadNotificationsCount: number;
            recentNotifications: any[];
        };
        cartItemCount: number;
        unreadMessagesCount: number;
    }>().props;
    const getInitials = useInitials();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    }

    function markNotificationAsRead(id: string) {
        router.patch(notifications.markRead.url({ id }), {}, { preserveScroll: true });
    }

    function markAllAsRead() {
        router.post(notifications.markAllRead.url(), {}, { preserveScroll: true });
    }

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Top banner */}
            <div className="bg-primary text-primary-foreground text-center text-xs py-1.5 font-medium tracking-wide">
                ✨ Give your pre-loved fashion a second life — Free shipping on first order!
            </div>

            {/* Main header */}
            <div className="bg-background/95 backdrop-blur-md border-b border-border/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Mobile menu */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden h-9 w-9"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 bg-background">
                                <SheetTitle className="sr-only">Navigation</SheetTitle>
                                <SheetHeader className="text-left pb-4 border-b">
                                    <Link href="/" className="text-xl font-bold font-heading tracking-tight flex items-center gap-2 ">
                                        <AppLogoIcon className="size-9 fill-current text-primary dark:text-white" /> C2C
                                    </Link>
                                </SheetHeader>
                                <nav className="flex flex-col gap-1 pt-4">
                                    {departments.map((dept) => (
                                        <Link
                                            key={dept.slug}
                                            href={`/search?department=${dept.slug}`}
                                            className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {dept.name}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>

                        {/* Logo */}
                        <Link
                            href="/"
                            className="shrink-0 text-xl font-bold font-heading tracking-tight flex items-center gap-2"
                        >
                            <AppLogoIcon className="size-9 fill-current text-primary dark:text-white" /> C2C
                        </Link>

                        {/* Category nav — desktop */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {departments.map((dept) => (
                                <Link
                                    key={dept.slug}
                                    href={`/search?department=${dept.slug}`}
                                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                                >
                                    {dept.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Search + Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search bar — desktop */}
                            <form
                                onSubmit={handleSearch}
                                className="hidden md:flex items-center"
                            >
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search fashion..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-9 w-48 lg:w-64 rounded-full border border-input bg-muted/50 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
                                    />
                                </div>
                            </form>

                            {/* Search icon — mobile */}
                            <Link
                                href="/search"
                                className="md:hidden"
                            >
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Search className="h-5 w-5" />
                                </Button>
                            </Link>

                            {/* Notifications */}
                            {auth.user && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="relative h-9 w-9 hidden sm:flex">
                                            <Bell className="h-5 w-5" />
                                            {auth.unreadNotificationsCount > 0 && (
                                                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground">
                                                    {auth.unreadNotificationsCount > 9 ? '9+' : auth.unreadNotificationsCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80">
                                        <DropdownMenuLabel className="flex justify-between items-center px-4 py-2">
                                            <span className="font-semibold text-sm">Notifications</span>
                                            {auth.unreadNotificationsCount > 0 && (
                                                <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-muted-foreground hover:text-primary" onClick={markAllAsRead}>
                                                    Mark all as read
                                                </Button>
                                            )}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {auth.recentNotifications && auth.recentNotifications.length > 0 ? (
                                                auth.recentNotifications.map((notif: any) => (
                                                    <div key={notif.id} className={`flex flex-col gap-1 p-3 border-b border-border/50 transition-colors hover:bg-muted/50 cursor-pointer ${notif.read_at ? 'opacity-70' : 'bg-primary/5'}`} onClick={() => !notif.read_at && markNotificationAsRead(notif.id)}>
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-sm font-medium leading-tight">{notif.data?.title || 'Notification'}</span>
                                                            {!notif.read_at && <span className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0" />}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground line-clamp-2">{notif.data?.message || 'You have a new message'}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center text-sm text-muted-foreground">
                                                    No recent notifications.
                                                </div>
                                            )}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {/* Messages */}
                            {auth.user && (
                                <Link href="/chat" className="relative">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
                                        <MessageCircle className="h-5 w-5" />
                                    </Button>
                                    {unreadMessagesCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground">
                                            {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                                        </Badge>
                                    )}
                                </Link>
                            )}

                            {/* Wishlist */}
                            {auth.user && (
                                <Link href="/wishlist">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )}

                            {/* Cart */}
                            <Link href="/cart" className="relative">
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <ShoppingBag className="h-5 w-5" />
                                </Button>
                                {cartItemCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground">
                                        {cartItemCount}
                                    </Badge>
                                )}
                            </Link>

                            {/* User menu */}
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-9 w-9 rounded-full p-0"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={auth.user.avatar}
                                                    alt={auth.user.name}
                                                />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                    {getInitials(auth.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="px-2 py-1.5">
                                            <p className="text-sm font-medium">{auth.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">
                                                <User className="h-4 w-4 mr-2" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/cart">
                                                <ShoppingBag className="h-4 w-4 mr-2" />
                                                My Cart
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/logout" method="post" as="button" className="w-full">
                                                Log out
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm" className="text-sm">
                                            <LogIn className="h-4 w-4 mr-1.5" />
                                            <span className="hidden sm:inline">Login</span>
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm" className="text-sm hidden sm:flex">
                                            Register
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
