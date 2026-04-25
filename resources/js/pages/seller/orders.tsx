import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Truck,
    Download,
    Printer,
    Package,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react';

type OrderItem = {
    id: number;
    product_id: number;
    quantity: number;
    price: string | number;
    product?: {
        name: string;
        price: number;
        images?: { image_url: string }[];
    };
};

type Shipping = {
    tracking_number?: string;
    courier?: string;
    status?: string;
};

type Order = {
    id: number;
    total_price: number;
    status: string;
    shipping_courier?: string;
    shipping_service?: string;
    shipping_cost?: number;
    created_at: string;
    buyer?: { id: number; name: string; email: string };
    items: OrderItem[];
    shipping?: Shipping | null;
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

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Awaiting Payment', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Clock className="h-3.5 w-3.5" /> },
    paid: { label: 'Ready to Ship', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: <Package className="h-3.5 w-3.5" /> },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: <Truck className="h-3.5 w-3.5" /> },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: <XCircle className="h-3.5 w-3.5" /> },
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

function printInvoice(order: Order) {
    const items = order.items.map((item) =>
        `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${item.product?.name ?? 'Product'}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatCurrency(Number(item.product?.price ?? item.price ?? 0))}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatCurrency(Number(item.product?.price ?? item.price ?? 0) * item.quantity)}</td>
        </tr>`
    ).join('');

    const html = `
        <html>
        <head><title>Invoice #${order.id}</title>
        <style>body{font-family:Arial,sans-serif;margin:40px;color:#1a1a1a}h1{font-size:22px;font-weight:700}table{width:100%;border-collapse:collapse}th{background:#f4f4f4;padding:10px 8px;text-align:left;font-size:13px}</style>
        </head>
        <body>
            <h1>INVOICE #${order.id}</h1>
            <p style="color:#666;font-size:13px">Date: ${new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <table style="margin-top:16px">
                <tr><th>Bill To</th><th>Shipping</th><th>Status</th><th>Order ID</th></tr>
                <tr>
                    <td style="padding:8px;font-size:13px">${order.buyer?.name ?? 'Customer'}<br><span style="color:#999">${order.buyer?.email ?? ''}</span></td>
                    <td style="padding:8px;font-size:13px">${(order.shipping_courier ?? '').toUpperCase()} ${order.shipping_service ?? ''}</td>
                    <td style="padding:8px;font-size:13px;text-transform:capitalize">${order.status}</td>
                    <td style="padding:8px;font-size:13px">#${order.id}</td>
                </tr>
            </table>
            ${order.shipping?.tracking_number ? `<p style="margin-top:8px;font-size:13px">Tracking: <strong>${order.shipping.tracking_number}</strong></p>` : ''}
            <table style="margin-top:24px">
                <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
                ${items}
            </table>
            <div style="margin-top:16px;text-align:right">
                <p style="font-size:13px;color:#666">Shipping: ${formatCurrency(order.shipping_cost ?? 0)}</p>
                <p style="font-size:18px;font-weight:700">Total: ${formatCurrency(order.total_price)}</p>
            </div>
            <script>window.onload=function(){window.print();window.close();}</script>
        </body></html>`;

    const win = window.open('', '_blank', 'width=800,height=600');
    if (win) {
        win.document.write(html);
        win.document.close();
    }
}

export default function SellerOrders({ orders, currentStatus }: Props) {
    const [processOrder, setProcessOrder] = useState<Order | null>(null);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [processing, setProcessing] = useState(false);

    function handleProcessShip() {
        if (!processOrder) return;
        if (!trackingNumber.trim()) {
            toast.error('Please enter a tracking number.');
            return;
        }
        setProcessing(true);
        router.patch(`/seller/orders/${processOrder.id}/status`, {
            status: 'shipped',
            tracking_number: trackingNumber,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Order #${processOrder.id} marked as shipped!`);
                setProcessOrder(null);
                setTrackingNumber('');
            },
            onError: () => toast.error('Failed to update order status.'),
            onFinish: () => setProcessing(false),
        });
    }

    function handleComplete(order: Order) {
        router.patch(`/seller/orders/${order.id}/status`, { status: 'completed' }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Order #${order.id} marked as completed!`),
            onError: () => toast.error('Failed to update order status.'),
        });
    }

    return (
        <>
            <Head title="Order Management" />

            {/* Process Order Modal */}
            <Dialog open={!!processOrder} onOpenChange={(open) => !open && setProcessOrder(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-primary" />
                            Process Order #{processOrder?.id}
                        </DialogTitle>
                    </DialogHeader>

                    {processOrder && (
                        <div className="space-y-5">
                            {/* Order Summary */}
                            <div className="rounded-lg border bg-muted/30 p-3 space-y-1 text-sm">
                                <p className="font-medium">Buyer: {processOrder.buyer?.name ?? 'Unknown'}</p>
                                <p className="text-muted-foreground">
                                    Courier: {(processOrder.shipping_courier ?? '').toUpperCase()} {processOrder.shipping_service}
                                </p>
                                <p className="text-muted-foreground">
                                    Items: {processOrder.items.map((i) => `${i.product?.name ?? 'Product'} ×${i.quantity}`).join(', ')}
                                </p>
                                <p className="font-semibold text-primary">
                                    Total: {formatCurrency(processOrder.total_price)}
                                </p>
                            </div>

                            {/* Tracking Input */}
                            <div className="space-y-2">
                                <Label htmlFor="tracking-number">Tracking Number *</Label>
                                <Input
                                    id="tracking-number"
                                    placeholder="e.g. JNE1234567890"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter the tracking number from your courier receipt.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={handleProcessShip}
                                    disabled={processing}
                                    className="w-full"
                                >
                                    <Truck className="h-4 w-4 mr-2" />
                                    {processing ? 'Processing...' : 'Confirm & Mark as Shipped'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => printInvoice(processOrder)}
                                >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print Invoice
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage and track all your orders
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href="/seller/orders/export" target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </a>
                    </Button>
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
                                    <TableHead>Tracking</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                            No orders found for this filter.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.data.map((order) => {
                                        const cfg = statusConfig[order.status] ?? { label: order.status, color: '', icon: null };
                                        return (
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
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                                                        {cfg.icon}
                                                        {cfg.label}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {order.shipping?.tracking_number ?? '—'}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* Print Invoice always */}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => printInvoice(order)}
                                                            title="Print Invoice"
                                                        >
                                                            <Printer className="h-4 w-4" />
                                                        </Button>
                                                        {/* Process / Ship */}
                                                        {order.status === 'paid' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    setProcessOrder(order);
                                                                    setTrackingNumber('');
                                                                }}
                                                            >
                                                                <Truck className="h-4 w-4 mr-1" />
                                                                Process
                                                            </Button>
                                                        )}
                                                        {order.status === 'shipped' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleComplete(order)}
                                                            >
                                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                                Complete
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
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
