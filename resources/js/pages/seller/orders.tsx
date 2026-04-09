import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type OrderItem = {
    id: number;
    product_id: number;
    quantity: number;
    product?: {
        name: string;
        price: number;
        images?: { image_url: string }[];
    };
};

type Order = {
    id: number;
    total_price: number;
    status: string;
    created_at: string;
    buyer?: { id: number; name: string; email: string };
    items: OrderItem[];
};

type PaginatedOrders = {
    data: Order[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    orders: PaginatedOrders;
    currentStatus: string;
};

const statusTabs = [
    { label: 'All Orders', value: 'all' },
    { label: 'Awaiting Payment', value: 'pending' },
    { label: 'Ready to Ship', value: 'paid' },
    { label: 'In Shipping', value: 'shipped' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
];

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

function handleStatusUpdate(orderId: number, newStatus: string) {
    router.patch(`/seller/orders/${orderId}/status`, { status: newStatus }, {
        preserveScroll: true,
    });
}

export default function SellerOrders({ orders, currentStatus }: Props) {
    return (
        <>
            <Head title="Order Management" />

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage and track all your orders
                    </p>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {statusTabs.map((tab) => (
                        <Button
                            key={tab.value}
                            variant={currentStatus === tab.value ? 'default' : 'outline'}
                            size="sm"
                            asChild
                        >
                            <Link
                                href={tab.value === 'all' ? '/seller/orders' : `/seller/orders?status=${tab.value}`}
                                preserveScroll
                            >
                                {tab.label}
                            </Link>
                        </Button>
                    ))}
                </div>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {orders.total} order{orders.total !== 1 ? 's' : ''} found
                        </CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Order ID</TableHead>
                                    <TableHead>Buyer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                            No orders found for this filter.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.data.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                #{order.id}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {order.buyer?.name ?? 'Unknown'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {order.buyer?.email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {order.items.slice(0, 2).map((item) => (
                                                        <span key={item.id} className="text-xs">
                                                            {item.product?.name ?? 'Product'} × {item.quantity}
                                                        </span>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <span className="text-xs text-muted-foreground">
                                                            +{order.items.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold tabular-nums">
                                                {formatCurrency(order.total_price)}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] ?? ''}`}>
                                                    {order.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {order.status === 'paid' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                                    >
                                                        Ship
                                                    </Button>
                                                )}
                                                {order.status === 'shipped' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                    >
                                                        Complete
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {orders.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 border-t px-6 py-4">
                            {orders.links.map((link, idx) => (
                                <Button
                                    key={idx}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    asChild={!!link.url}
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            preserveScroll
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}
