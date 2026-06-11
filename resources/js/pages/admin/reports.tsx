import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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
    AlertTriangle,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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
    const [reportToResolve, setReportToResolve] = useState<Report | null>(null);
    const [resolving, setResolving] = useState(false);

    function handleStatusUpdate(report: Report, status: string) {
        router.patch(`/admin/reports/${report.id}/status`, { status }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Report marked as ${status}.`),
            onError: () => toast.error('Failed to update report.'),
        });
    }

    function confirmRemoveProduct() {
        if (!reportToResolve) return;
        setResolving(true);
        router.post(`/admin/reports/${reportToResolve.id}/remove-product`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Product removed and report resolved.');
                setReportToResolve(null);
            },
            onError: () => toast.error('Failed to remove product.'),
            onFinish: () => setResolving(false),
        });
    }

    const activeTab = filters.status ?? '';

    // Count by status (from current page)
    const pendingCount = reports.data.filter(r => r.status === 'pending').length;

    return (
        <AdminLayout title="Report Management" activePath="/admin/reports">
            <Head title="Report Management — Admin" />

            {/* Remove Product Confirmation Modal */}
            <Dialog open={!!reportToResolve} onOpenChange={(open) => !open && setReportToResolve(null)}>
                <DialogContent className="sm:max-w-lg overflow-hidden border border-red-100 dark:border-red-900/30 p-0 shadow-2xl">
                    {/* Top Accent Gradient Line */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
                    
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 mb-4 shadow-inner ring-4 ring-red-50/50 dark:ring-red-950/10">
                                <Trash2 className="h-7 w-7 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground tracking-tight">
                                Remove Listing & Resolve Report
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                                You are about to remove this product listing. Please verify the details below before proceeding.
                            </p>
                        </div>

                        {/* Product & Seller Info Card */}
                        {reportToResolve && reportToResolve.product && (
                            <div className="rounded-xl border border-muted/80 bg-muted/30 p-4 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Product Title</p>
                                        <p className="font-semibold text-sm text-foreground truncate mt-0.5">{reportToResolve.product.name}</p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] bg-background capitalize shrink-0">
                                        Status: {reportToResolve.product.status}
                                    </Badge>
                                </div>
                                <div className="border-t border-muted/60 pt-2 flex justify-between text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Seller:</span>{' '}
                                        <span className="font-medium text-foreground">{reportToResolve.product.seller?.name ?? 'Unknown'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Report Reason:</span>{' '}
                                        <span className="font-medium text-red-600 dark:text-red-400">{reportToResolve.reason}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Consequences Callout */}
                        <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 dark:border-red-950/30 dark:bg-red-950/10 space-y-2">
                            <h4 className="text-xs font-semibold text-red-800 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Action Consequences
                            </h4>
                            <ul className="text-xs text-red-700/80 dark:text-red-300/80 space-y-1 list-disc pl-4 leading-relaxed">
                                <li>The product listing will be immediately deactivated and hidden from the marketplace.</li>
                                <li>The report status will be updated to "Resolved".</li>
                                <li>The seller will be notified that their listing was removed due to policy violations.</li>
                            </ul>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 bg-muted/30 border-t flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setReportToResolve(null)}
                            disabled={resolving}
                            className="w-full sm:w-auto font-medium transition-colors hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmRemoveProduct}
                            disabled={resolving}
                            className="w-full sm:w-auto font-medium shadow-sm bg-red-600 hover:bg-red-700 active:bg-red-800 border-red-700 hover:border-red-800 text-white dark:bg-red-700 dark:hover:bg-red-600"
                        >
                            {resolving ? 'Removing...' : 'Confirm Removal'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                                                onClick={() => setReportToResolve(report)}
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
