import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    Flag,
    CheckCircle2,
    Clock,
    XCircle,
    Trash2,
    BarChart3,
    AlertCircle,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';

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

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
    pending:  { color: 'text-amber-700', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200',   icon: <Clock className="h-3.5 w-3.5" />,       label: 'Pending' },
    reviewed: { color: 'text-blue-700',  bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200',       icon: <BarChart3 className="h-3.5 w-3.5" />,   label: 'Reviewed' },
    resolved: { color: 'text-green-700', bg: 'bg-green-50 dark:bg-green-950/30 border-green-200',    icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: 'Resolved' },
    dismissed:{ color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200',       icon: <XCircle className="h-3.5 w-3.5" />,     label: 'Dismissed' },
};

const statusTabs = [
    { label: 'All',       value: '' },
    { label: 'Pending',   value: 'pending' },
    { label: 'Reviewed',  value: 'reviewed' },
    { label: 'Resolved',  value: 'resolved' },
    { label: 'Dismissed', value: 'dismissed' },
];

export default function AdminReports({ reports, filters }: Props) {

    function handleStatusUpdate(report: Report, status: string) {
        router.patch(`/admin/reports/${report.id}/status`, { status }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Report marked as ${status}.`),
            onError: () => toast.error('Failed to update report.'),
        });
    }

    function handleRemoveProduct(report: Report) {
        if (!window.confirm(`Remove "${report.product?.name}"? This will deactivate the listing and resolve the report.`)) return;
        router.post(`/admin/reports/${report.id}/remove-product`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Product removed and report resolved.'),
            onError: () => toast.error('Failed to remove product.'),
        });
    }

    const activeTab = filters.status ?? '';

    // Count by status (from current page)
    const pendingCount = reports.data.filter(r => r.status === 'pending').length;

    return (
        <AdminLayout title="Report Management" activePath="/admin/reports">
            <Head title="Report Management — Admin" />

            <div className="space-y-5">
                {/* Status Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {statusTabs.slice(1).map((tab) => {
                        const cfg = statusConfig[tab.value];
                        return (
                            <button
                                key={tab.value}
                                onClick={() => router.get('/admin/reports', { status: tab.value }, { preserveScroll: true })}
                                className={`rounded-xl border p-3 text-left transition-all hover:shadow-sm ${activeTab === tab.value ? cfg.bg + ' ' + cfg.color : 'bg-card hover:bg-muted/30'}`}
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className={activeTab === tab.value ? cfg.color : 'text-muted-foreground'}>{cfg.icon}</span>
                                    <span className={`text-xs font-medium ${activeTab === tab.value ? cfg.color : 'text-muted-foreground'}`}>{cfg.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                    {statusTabs.map((tab) => (
                        <Button
                            key={tab.value}
                            size="sm"
                            variant={activeTab === tab.value ? 'default' : 'outline'}
                            onClick={() => router.get('/admin/reports', tab.value ? { status: tab.value } : {}, { preserveScroll: true })}
                        >
                            {tab.label}
                            {tab.value === 'pending' && pendingCount > 0 && (
                                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
                                    {pendingCount}
                                </span>
                            )}
                        </Button>
                    ))}
                </div>

                {/* Table */}
                <Card>
                    <CardHeader className="py-3 px-4 border-b">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Flag className="h-4 w-4" />
                            {reports.total} report{reports.total !== 1 ? 's' : ''}
                            {filters.status && (
                                <Badge variant="outline" className="text-[10px] capitalize">{filters.status}</Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
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
                                        <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                                            <Flag className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                            <p>No reports found.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.data.map((report) => {
                                        const cfg = statusConfig[report.status] ?? statusConfig['dismissed'];
                                        return (
                                            <TableRow key={report.id} className="hover:bg-muted/20">
                                                <TableCell>
                                                    <p className="text-sm font-medium">{report.reporter?.name ?? 'Unknown'}</p>
                                                    <p className="text-xs text-muted-foreground">{report.reporter?.email}</p>
                                                </TableCell>
                                                <TableCell>
                                                    {report.product ? (
                                                        <Link
                                                            href={`/products/${report.product.id}`}
                                                            className="text-sm font-medium hover:underline text-primary"
                                                        >
                                                            {report.product.name}
                                                        </Link>
                                                    ) : '—'}
                                                    {report.product?.status === 'inactive' && (
                                                        <p className="text-[10px] text-red-500 font-semibold mt-0.5 flex items-center gap-0.5">
                                                            <AlertCircle className="h-3 w-3" /> Removed
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {report.product?.seller?.name ?? '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm font-medium">{report.reason}</p>
                                                    {report.description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{report.description}</p>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                                                        {cfg.icon}
                                                        {cfg.label}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                    {new Date(report.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {report.status === 'pending' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleStatusUpdate(report, 'reviewed')}
                                                                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
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
                                                                className="text-slate-600 border-slate-200 hover:bg-slate-50"
                                                            >
                                                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                                                Dismiss
                                                            </Button>
                                                        )}
                                                        {report.product && report.product.status !== 'inactive' && ['pending', 'reviewed'].includes(report.status) && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                                onClick={() => handleRemoveProduct(report)}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                                Remove
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
                        <div className="flex items-center justify-center gap-1.5 border-t px-6 py-3">
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
            </div>
        </AdminLayout>
    );
}
