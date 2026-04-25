import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Flag,
    LogOut,
    ShieldCheck,
    TrendingUp,
    Package,
    DollarSign,
    AlertTriangle,
    UserX,
    CheckCircle2,
    Clock,
    BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type Stats = {
    totalUsers: number;
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingReports: number;
    bannedUsers: number;
};

type MonthlyUser = {
    month: string;
    count: number;
};

type RecentReport = {
    id: number;
    reason: string;
    status: string;
    created_at: string;
    reporter?: { name: string };
    product?: { name: string; id: number };
};

type Props = {
    stats: Stats;
    monthlyUsers: MonthlyUser[];
    recentReports: RecentReport[];
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

const navItems = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/reports', label: 'Reports', icon: Flag },
];

function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
    const { auth } = usePage<any>().props;

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-60 shrink-0 border-r bg-card flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg tracking-tight">Admin Panel</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">C2C Marketplace</p>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-3 border-t space-y-2">
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">{auth?.user?.name}</p>
                        <p>{auth?.user?.email}</p>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                    <Badge variant="outline" className="gap-1 text-primary border-primary/30">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Admin
                    </Badge>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AdminDashboard({ stats, monthlyUsers, recentReports }: Props) {
    const maxUsers = Math.max(...monthlyUsers.map((m) => m.count), 1);

    const kpiCards = [
        { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
        { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
        { title: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: Package, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
        { title: 'Active Products', value: `${stats.activeProducts} / ${stats.totalProducts}`, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
        { title: 'Pending Reports', value: stats.pendingReports.toLocaleString(), icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
        { title: 'Banned Users', value: stats.bannedUsers.toLocaleString(), icon: UserX, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-950/30' },
    ];

    const reportStatusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
        pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
        reviewed: { color: 'bg-blue-100 text-blue-800', icon: <BarChart3 className="h-3 w-3" /> },
        resolved: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-3 w-3" /> },
        dismissed: { color: 'bg-slate-100 text-slate-800', icon: null },
    };

    return (
        <AdminLayout title="Dashboard Overview">
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {kpiCards.map((kpi) => (
                        <Card key={kpi.title} className="relative overflow-hidden">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                                        <p className="text-2xl font-bold mt-1 tracking-tight">{kpi.value}</p>
                                    </div>
                                    <div className={`rounded-xl p-2.5 ${kpi.bg}`}>
                                        <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly User Growth Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                New Users (Last 6 Months)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 h-40">
                                {monthlyUsers.map((item, idx) => (
                                    <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                                        <span className="text-xs font-medium text-muted-foreground">{item.count}</span>
                                        <div
                                            className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary/40 transition-all duration-500"
                                            style={{ height: `${Math.max((item.count / maxUsers) * 130, 8)}px` }}
                                        />
                                        <span className="text-[10px] text-muted-foreground">{item.month.split(' ')[0]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Reports */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Flag className="h-4 w-4 text-red-500" />
                                Recent Reports
                            </CardTitle>
                            <Button size="sm" variant="outline" asChild>
                                <Link href="/admin/reports">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentReports.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No reports yet.</p>
                            ) : (
                                recentReports.map((report) => {
                                    const cfg = reportStatusConfig[report.status] ?? { color: '', icon: null };
                                    return (
                                        <div key={report.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{report.product?.name ?? 'Unknown product'}</p>
                                                <p className="text-xs text-muted-foreground truncate">By {report.reporter?.name} · {report.reason}</p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${cfg.color}`}>
                                                {cfg.icon}
                                                {report.status}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Links */}
                <div className="flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/admin/users">
                            <Users className="h-4 w-4 mr-2" />
                            Manage Users
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/reports">
                            <Flag className="h-4 w-4 mr-2" />
                            Review Reports
                        </Link>
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
}
