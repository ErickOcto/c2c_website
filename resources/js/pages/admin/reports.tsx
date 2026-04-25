import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    LayoutDashboard,
    Users,
    Flag,
    LogOut,
    ShieldCheck,
    CheckCircle2,
    Clock,
    XCircle,
    Trash2,
    BarChart3,
} from 'lucide-react';

type Report = {
    id: number;
    reason: string;
    description?: string;
    status: string;
    created_at: string;
    reporter?: { id: number; name: string; email: string };
    product?: { id: number; name: string; status: string; seller?: { name: string } };
};

type PaginatedReports = {
    data: Report[];
    total: number;
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    reports: PaginatedReports;
    filters: { status?: string };
};

const navItems = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/reports', label: 'Reports', icon: Flag },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3.5 w-3.5" /> },
    reviewed: { color: 'bg-blue-100 text-blue-800', icon: <BarChart3 className="h-3.5 w-3.5" /> },
    resolved: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    dismissed: { color: 'bg-slate-100 text-slate-600', icon: <XCircle className="h-3.5 w-3.5" /> },
};

const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Reviewed', value: 'reviewed' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Dismissed', value: 'dismissed' },
];

function AdminSidebar({ activePath }: { activePath: string }) {
    return (
        <aside className="w-60 shrink-0 border-r bg-card flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg tracking-tight">Admin Panel</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">C2C Marketplace</p>
            </div>
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activePath === item.href
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="p-3 border-t">
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
    );
}

export default function AdminReports({ reports, filters }: Props) {

    function handleStatusUpdate(report: Report, status: string) {
        router.patch(`/admin/reports/${report.id}/status`, { status }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Report marked as ${status}.`),
            onError: () => toast.error('Failed to update report.'),
        });
    }

    function handleRemoveProduct(report: Report) {
        router.post(`/admin/reports/${report.id}/remove-product`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Product removed and report resolved.`),
            onError: () => toast.error('Failed to remove product.'),
        });
    }

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar activePath="/admin/reports" />

            <div className="flex-1 flex flex-col min-w-0">
                <Head title="Report Management — Admin" />
                <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight">Report Management</h1>
                    <Badge variant="outline" className="gap-1 text-primary border-primary/30">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Admin
                    </Badge>
                </header>

                <main className="flex-1 p-6 space-y-5 overflow-y-auto">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {statusTabs.map((tab) => (
                            <Button
                                key={tab.value}
                                size="sm"
                                variant={(filters.status ?? '') === tab.value ? 'default' : 'outline'}
                                onClick={() => router.get('/admin/reports', tab.value ? { status: tab.value } : {}, { preserveScroll: true })}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    {/* Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">{reports.total} report{reports.total !== 1 ? 's' : ''}</CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reporter</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Seller</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                                No reports found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        reports.data.map((report) => {
                                            const cfg = statusConfig[report.status] ?? { color: '', icon: null };
                                            return (
                                                <TableRow key={report.id}>
                                                    <TableCell className="text-sm">
                                                        <p className="font-medium">{report.reporter?.name ?? 'Unknown'}</p>
                                                        <p className="text-xs text-muted-foreground">{report.reporter?.email}</p>
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {report.product ? (
                                                            <Link
                                                                href={`/products/${report.product.id}`}
                                                                className="font-medium hover:underline text-primary"
                                                            >
                                                                {report.product.name}
                                                            </Link>
                                                        ) : '—'}
                                                        {report.product?.status === 'inactive' && (
                                                            <p className="text-[10px] text-red-500 font-medium">Removed</p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {report.product?.seller?.name ?? '—'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="text-sm font-medium">{report.reason}</p>
                                                        {report.description && (
                                                            <p className="text-xs text-muted-foreground line-clamp-2">{report.description}</p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                                                            {cfg.icon}
                                                            {report.status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(report.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {report.status === 'pending' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleStatusUpdate(report, 'reviewed')}
                                                                >
                                                                    <BarChart3 className="h-3.5 w-3.5 mr-1" />
                                                                    Review
                                                                </Button>
                                                            )}
                                                            {['pending', 'reviewed'].includes(report.status) && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleStatusUpdate(report, 'dismissed')}
                                                                >
                                                                    <XCircle className="h-3.5 w-3.5 mr-1" />
                                                                    Dismiss
                                                                </Button>
                                                            )}
                                                            {report.product && report.product.status !== 'inactive' && ['pending', 'reviewed'].includes(report.status) && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                                    onClick={() => {
                                                                        if (window.confirm(`Remove "${report.product?.name}"? This will deactivate the product and resolve the report.`)) {
                                                                            handleRemoveProduct(report);
                                                                        }
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                                    Remove Product
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
                        {reports.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 border-t px-6 py-4">
                                {reports.links.map((link, idx) => (
                                    <Button
                                        key={idx}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={!!link.url}
                                    >
                                        {link.url ? (
                                            <Link href={link.url} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </Card>
                </main>
            </div>
        </div>
    );
}
