import { Head, Link } from '@inertiajs/react';
import {
    Users,
    Flag,
    Package,
    DollarSign,
    AlertTriangle,
    UserX,
    TrendingUp,
    Store,
    ShoppingCart,
    CheckCircle2,
    Clock,
    XCircle,
    BarChart3,
    ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

type Stats = {
    totalUsers: number;
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingReports: number;
    bannedUsers: number;
    totalSellers: number;
    totalBuyers: number;
};

type MonthlyData = { month: string; count?: number; revenue?: number };

type OrderStatuses = Record<string, number>;

type TopSeller = {
    id: number;
    name: string;
    email: string;
    products_count: number;
    total_revenue: number | null;
};

type RecentReport = {
    id: number;
    reason: string;
    status: string;
    created_at: string;
    reporter?: { name: string };
    product?: { name: string; id: number };
};

type RecentOrder = {
    id: number;
    status: string;
    total_price: number;
    created_at: string;
    buyer?: { name: string };
    items?: { product?: { name: string } }[];
};

type Props = {
    stats: Stats;
    monthlyUsers: MonthlyData[];
    monthlyRevenue: MonthlyData[];
    orderStatuses: OrderStatuses;
    topSellers: TopSeller[];
    recentReports: RecentReport[];
    recentOrders: RecentOrder[];
};

function formatCurrency(value: number) {
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}K`;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function formatCurrencyFull(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

const STATUS_COLORS: Record<string, string> = {
    pending:   '#f59e0b',
    paid:      '#10b981',
    shipped:   '#3b82f6',
    completed: '#22c55e',
    cancelled: '#ef4444',
    processing:'#8b5cf6',
};

const REPORT_STATUS: Record<string, { color: string; icon: React.ReactNode }> = {
    pending:  { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: <Clock className="h-3 w-3" /> },
    reviewed: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: <BarChart3 className="h-3 w-3" /> },
    resolved: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle2 className="h-3 w-3" /> },
    dismissed:{ color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', icon: <XCircle className="h-3 w-3" /> },
};

const ORDER_STATUS: Record<string, string> = {
    pending:    'bg-amber-100 text-amber-800',
    paid:       'bg-green-100 text-green-800',
    shipped:    'bg-blue-100 text-blue-800',
    completed:  'bg-emerald-100 text-emerald-800',
    cancelled:  'bg-red-100 text-red-800',
    processing: 'bg-purple-100 text-purple-800',
};

export default function AdminDashboard({ stats, monthlyUsers, monthlyRevenue, orderStatuses, topSellers, recentReports, recentOrders }: Props) {
    // Prepare pie data
    const pieData = Object.entries(orderStatuses).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: STATUS_COLORS[status] ?? '#94a3b8',
    }));

    const kpiCards = [
        {
            title: 'Total Revenue',
            value: formatCurrency(stats.totalRevenue),
            subtext: 'from paid transactions',
            icon: DollarSign,
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
            iconColor: 'text-emerald-600',
            trend: '+12%',
            trendUp: true,
        },
        {
            title: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            subtext: `${stats.totalBuyers} buyers · ${stats.totalSellers} sellers`,
            icon: Users,
            iconBg: 'bg-blue-50 dark:bg-blue-950/40',
            iconColor: 'text-blue-600',
            trend: null,
            trendUp: true,
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            subtext: 'across all sellers',
            icon: ShoppingCart,
            iconBg: 'bg-violet-50 dark:bg-violet-950/40',
            iconColor: 'text-violet-600',
            trend: null,
            trendUp: true,
        },
        {
            title: 'Active Products',
            value: stats.activeProducts.toLocaleString(),
            subtext: `of ${stats.totalProducts} total listings`,
            icon: Package,
            iconBg: 'bg-orange-50 dark:bg-orange-950/40',
            iconColor: 'text-orange-600',
            trend: null,
            trendUp: true,
        },
        {
            title: 'Pending Reports',
            value: stats.pendingReports.toLocaleString(),
            subtext: 'awaiting review',
            icon: AlertTriangle,
            iconBg: 'bg-red-50 dark:bg-red-950/40',
            iconColor: 'text-red-600',
            trend: null,
            trendUp: false,
        },
        {
            title: 'Banned Users',
            value: stats.bannedUsers.toLocaleString(),
            subtext: 'accounts suspended',
            icon: UserX,
            iconBg: 'bg-slate-50 dark:bg-slate-800/50',
            iconColor: 'text-slate-500',
            trend: null,
            trendUp: false,
        },
    ];

    return (
        <AdminLayout title="Dashboard Overview" activePath="/admin/dashboard">
            <Head title="Admin Dashboard — C2C" />

            <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {kpiCards.map((kpi) => (
                        <Card key={kpi.title} className="relative overflow-hidden group hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                                        <p className="text-2xl font-bold mt-1 tracking-tight truncate">{kpi.value}</p>
                                        <p className="text-xs text-muted-foreground mt-1 truncate">{kpi.subtext}</p>
                                    </div>
                                    <div className={`rounded-xl p-2.5 shrink-0 ${kpi.iconBg}`}>
                                        <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                                    </div>
                                </div>
                                {kpi.trend && (
                                    <div className="mt-3 flex items-center gap-1">
                                        <span className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                                            <TrendingUp className="h-3 w-3" />
                                            {kpi.trend} this month
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Trend */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-emerald-500" />
                                        Monthly Revenue
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-0.5">Last 6 months</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-52">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v.split(' ')[0]} />
                                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={64} />
                                        <Tooltip
                                            formatter={(value) => [formatCurrencyFull(Number(value ?? 0)), 'Revenue']}
                                            labelStyle={{ fontSize: 12 }}
                                            contentStyle={{ fontSize: 12 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            fill="url(#revenueGradient)"
                                            dot={{ r: 3, fill: '#10b981' }}
                                            activeDot={{ r: 5 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Growth */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        New User Registrations
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-0.5">Last 6 months</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-52">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyUsers} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                                        <defs>
                                            <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v.split(' ')[0]} />
                                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                        <Tooltip
                                            formatter={(value) => [Number(value ?? 0), 'New Users']}
                                            labelStyle={{ fontSize: 12 }}
                                            contentStyle={{ fontSize: 12 }}
                                        />
                                        <Bar dataKey="count" fill="url(#usersGradient)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Row: Order Status Pie + Top Sellers */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Order Status Breakdown */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4 text-violet-500" />
                                Order Status Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pieData.length > 0 ? (
                                <div className="h-52">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={80}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value, name) => [Number(value ?? 0), String(name)]}
                                                contentStyle={{ fontSize: 12 }}
                                            />
                                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-52 flex items-center justify-center text-sm text-muted-foreground">
                                    No order data yet
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Sellers */}
                    <Card className="lg:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Store className="h-4 w-4 text-orange-500" />
                                Top Sellers
                            </CardTitle>
                            <Button size="sm" variant="outline" asChild>
                                <Link href="/admin/users">
                                    View All <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {topSellers.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No sellers yet.</p>
                            ) : (
                                topSellers.map((seller, idx) => (
                                    <div key={seller.id} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                            <span className="text-[10px] font-bold text-muted-foreground">#{idx + 1}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{seller.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{seller.products_count} products</p>
                                        </div>
                                        <span className="text-sm font-semibold text-emerald-600 shrink-0">
                                            {seller.total_revenue ? formatCurrency(seller.total_revenue) : 'Rp 0'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Row: Recent Reports + Recent Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Reports */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Flag className="h-4 w-4 text-red-500" />
                                Recent Reports
                            </CardTitle>
                            <Button size="sm" variant="outline" asChild>
                                <Link href="/admin/reports">
                                    View All <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentReports.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">No reports yet.</p>
                            ) : (
                                recentReports.map((report) => {
                                    const cfg = REPORT_STATUS[report.status] ?? { color: '', icon: null };
                                    return (
                                        <div key={report.id} className="flex items-start justify-between gap-3 py-2 border-b last:border-0">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate">{report.product?.name ?? 'Unknown product'}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    By {report.reporter?.name} · {report.reason}
                                                </p>
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

                    {/* Recent Orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4 text-violet-500" />
                                Recent Orders
                            </CardTitle>
                            <Button size="sm" variant="outline" asChild>
                                <Link href="/admin/users">
                                    Manage <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">No orders yet.</p>
                            ) : (
                                recentOrders.map((order) => {
                                    const statusClass = ORDER_STATUS[order.status] ?? 'bg-slate-100 text-slate-600';
                                    const firstItem = order.items?.[0];
                                    return (
                                        <div key={order.id} className="flex items-start justify-between gap-3 py-2 border-b last:border-0">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate">
                                                    {firstItem?.product?.name ?? 'Order #' + order.id}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    By {order.buyer?.name} · {new Date(order.created_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <span className="text-sm font-semibold">
                                                    {formatCurrency(order.total_price)}
                                                </span>
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusClass}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
