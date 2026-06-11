import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Flag,
    LogOut,
    ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const navItems = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/reports', label: 'Reports', icon: Flag },
];

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    activePath: string;
}

export function AdminLayout({ children, title, activePath }: AdminLayoutProps) {
    const { auth } = usePage<any>().props;

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 border-r bg-card flex flex-col shadow-sm">
                {/* Logo area */}
                <div className="p-5 border-b">
                    <div className="flex items-center gap-2.5">
                        <div className="rounded-xl bg-primary/10 p-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <span className="font-bold text-base tracking-tight block">Admin Panel</span>
                            <p className="text-[11px] text-muted-foreground leading-none mt-0.5">C2C Marketplace</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 pt-2 pb-1.5">Navigation</p>
                    {navItems.map((item) => {
                        const isActive = activePath === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                                {auth?.user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate leading-none">{auth?.user?.name}</p>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{auth?.user?.email}</p>
                        </div>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="border-b bg-card/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                    </div>
                    <Badge variant="outline" className="gap-1.5 text-primary border-primary/30 bg-primary/5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Administrator
                    </Badge>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
