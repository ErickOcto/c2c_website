import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ChartUpIcon,
    ShoppingBag02Icon,
    Package01Icon,
    DeliveryTruck01Icon,
    MoneyBag02Icon,
    AnalyticsUpIcon,
} from '@hugeicons/core-free-icons';

type KPIs = {
    totalProducts: number;
    activeProducts: number;
    newOrders: number;
    totalRevenue: number;
    itemsToShip: number;
};

type MonthlyRevenue = {
    month: string;
    revenue: number;
};

type RecentOrder = {
    id: number;
    total_price: number;
    status: string;
    created_at: string;
    buyer?: { name: string; email: string };
};

type Props = {
    kpis: KPIs;
    monthlyRevenue: MonthlyRevenue[];
    recentOrders: RecentOrder[];
};

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

export default function SellerDashboard({ kpis, monthlyRevenue, recentOrders }: Props) {
    const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

    return (
        <>
            <Head title="Seller Dashboard" />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-6 py-4 md:py-6">
                        {/* Page Header */}
                        <div className="flex items-center justify-between px-4 lg:px-6">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Seller Dashboard</h1>
                                <p className="text-sm text-muted-foreground">
                                    Overview of your store performance
                                </p>
                            </div>
                            <Button asChild>
                                <Link href="/seller/products/create">
                                    + New Product
                                </Link>
                            </Button>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                            <Card className="@container/card bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card">
                                <CardHeader>
                                    <CardDescription className="flex items-center gap-2">
                                        <HugeiconsIcon icon={ShoppingBag02Icon} strokeWidth={2} className="size-4" />
                                        New Orders
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                        {kpis.newOrders}
                                    </CardTitle>
                                    <CardAction>
                                        <Badge variant="outline" className="text-orange-600 border-orange-200 dark:border-orange-800">
                                            Pending
                                        </Badge>
                                    </CardAction>
                                </CardHeader>
                                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                    <div className="text-muted-foreground">
                                        Orders awaiting processing
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card className="@container/card bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card">
                                <CardHeader>
                                    <CardDescription className="flex items-center gap-2">
                                        <HugeiconsIcon icon={MoneyBag02Icon} strokeWidth={2} className="size-4" />
                                        Total Revenue
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                        {formatCurrency(kpis.totalRevenue)}
                                    </CardTitle>
                                    <CardAction>
                                        <Badge variant="outline">
                                            <HugeiconsIcon icon={ChartUpIcon} strokeWidth={2} />
                                            All Time
                                        </Badge>
                                    </CardAction>
                                </CardHeader>
                                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                    <div className="text-muted-foreground">
                                        Revenue from completed orders
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card className="@container/card bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card">
                                <CardHeader>
                                    <CardDescription className="flex items-center gap-2">
                                        <HugeiconsIcon icon={DeliveryTruck01Icon} strokeWidth={2} className="size-4" />
                                        Items to Ship
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                        {kpis.itemsToShip}
                                    </CardTitle>
                                    <CardAction>
                                        <Badge variant="outline" className="text-blue-600 border-blue-200 dark:border-blue-800">
                                            Ready
                                        </Badge>
                                    </CardAction>
                                </CardHeader>
                                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                    <div className="text-muted-foreground">
                                        Paid orders awaiting shipment
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card className="@container/card bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card">
                                <CardHeader>
                                    <CardDescription className="flex items-center gap-2">
                                        <HugeiconsIcon icon={Package01Icon} strokeWidth={2} className="size-4" />
                                        Active Products
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                        {kpis.activeProducts}
                                        <span className="text-base font-normal text-muted-foreground">
                                            {' '}/ {kpis.totalProducts}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                    <div className="text-muted-foreground">
                                        Active listings in your store
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Sales Trend Chart */}
                        <div className="px-4 lg:px-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <HugeiconsIcon icon={AnalyticsUpIcon} strokeWidth={2} className="size-5" />
                                        Sales Trend (Last 6 Months)
                                    </CardTitle>
                                </CardHeader>
                                <div className="px-6 pb-6">
                                    <div className="flex items-end gap-2 h-48">
                                        {monthlyRevenue.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex flex-1 flex-col items-center gap-2"
                                            >
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {formatCurrency(item.revenue)}
                                                </span>
                                                <div
                                                    className="w-full rounded-t-md bg-linear-to-t from-primary/80 to-primary/40 transition-all duration-500"
                                                    style={{
                                                        height: `${Math.max((item.revenue / maxRevenue) * 160, 8)}px`,
                                                    }}
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {item.month.split(' ')[0]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Recent Orders */}
                        <div className="px-4 lg:px-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/seller/orders">View All</Link>
                                    </Button>
                                </CardHeader>
                                <div className="px-6 pb-6">
                                    {recentOrders.length === 0 ? (
                                        <p className="text-sm text-muted-foreground py-8 text-center">
                                            No orders yet. Start listing products to receive orders!
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentOrders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between rounded-lg border p-4"
                                                >
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium">
                                                            Order #{order.id}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {order.buyer?.name ?? 'Unknown Buyer'} •{' '}
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold tabular-nums">
                                                            {formatCurrency(order.total_price)}
                                                        </span>
                                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] ?? ''}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
