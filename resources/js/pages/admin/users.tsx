import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Search,
    Ban,
    CheckCircle2,
    UserX,
    ShieldCheck,
    Users,
    UserCheck,
    AlertTriangle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    is_admin: boolean;
    is_banned: boolean;
    created_at: string;
    order_count?: number;
};

type PaginatedUsers = {
    data: User[];
    total: number;
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    users: PaginatedUsers;
    filters: { q?: string; status?: string };
};

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
    admin:  { label: 'Admin',  className: 'bg-primary/10 text-primary border-primary/20' },
    seller: { label: 'Seller', className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400' },
    buyer:  { label: 'Buyer',  className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400' },
};

export default function AdminUsers({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.q ?? '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/users', { q: search }, { preserveScroll: true });
    }

    const [userToBan, setUserToBan] = useState<User | null>(null);
    const [banning, setBanning] = useState(false);

    function handleBan(user: User) {
        setUserToBan(user);
    }

    function confirmBan() {
        if (!userToBan) return;
        setBanning(true);
        router.patch(`/admin/users/${userToBan.id}/ban`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${userToBan.name} has been banned.`);
                setUserToBan(null);
            },
            onError: () => toast.error('Failed to ban user.'),
            onFinish: () => setBanning(false),
        });
    }

    function handleUnban(user: User) {
        router.patch(`/admin/users/${user.id}/unban`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success(`${user.name} has been unbanned.`),
            onError: () => toast.error('Failed to unban user.'),
        });
    }

    const activeFilter = filters.status ?? 'all';

    return (
        <AdminLayout title="User Management" activePath="/admin/users">
            <Head title="User Management — Admin" />

            {/* Ban Confirmation Modal */}
            <Dialog open={!!userToBan} onOpenChange={(open) => !open && setUserToBan(null)}>
                <DialogContent className="sm:max-w-lg overflow-hidden border border-red-100 dark:border-red-900/30 p-0 shadow-2xl">
                    {/* Top Accent Gradient Line */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
                    
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 mb-4 shadow-inner ring-4 ring-red-50/50 dark:ring-red-950/10">
                                <Ban className="h-7 w-7 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground tracking-tight">
                                Restrict User Access
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                                You are about to ban this user. Please confirm the identity and the consequences of this action.
                            </p>
                        </div>

                        {/* User Profile Preview Card */}
                        {userToBan && (
                            <div className="rounded-xl border border-muted/80 bg-muted/30 p-4 flex items-center gap-4 transition-all duration-200 hover:bg-muted/50">
                                <Avatar className="h-12 w-12 shrink-0 border border-muted/80 ring-2 ring-background">
                                    <AvatarFallback className="text-sm bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 font-bold">
                                        {userToBan.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm text-foreground truncate">{userToBan.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{userToBan.email}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-background">
                                            Role: {userToBan.is_admin ? 'Admin' : (userToBan.role.charAt(0).toUpperCase() + userToBan.role.slice(1))}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-background text-red-500 border-red-200">
                                            Pending Ban
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Consequences Alert Callout */}
                        <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 dark:border-red-950/30 dark:bg-red-950/10 space-y-2">
                            <h4 className="text-xs font-semibold text-red-800 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Action Consequences
                            </h4>
                            <ul className="text-xs text-red-700/80 dark:text-red-300/80 space-y-1 list-disc pl-4 leading-relaxed">
                                <li>The user's active session will be terminated immediately.</li>
                                <li>All active product listings for this user will be suspended.</li>
                                <li>They will no longer be able to log in, purchase, or list products.</li>
                            </ul>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 bg-muted/30 border-t flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setUserToBan(null)}
                            disabled={banning}
                            className="w-full sm:w-auto font-medium transition-colors hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmBan}
                            disabled={banning}
                            className="w-full sm:w-auto font-medium shadow-sm bg-red-600 hover:bg-red-700 active:bg-red-800 border-red-700 hover:border-red-800 text-white dark:bg-red-700 dark:hover:bg-red-600"
                        >
                            {banning ? 'Restricting...' : 'Confirm Restriction'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="space-y-5">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-2">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{users.total}</p>
                                <p className="text-xs text-muted-foreground">Total Users</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-2">
                                <UserCheck className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{users.data.filter(u => !u.is_banned).length}</p>
                                <p className="text-xs text-muted-foreground">Active on this page</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-2">
                                <UserX className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{users.data.filter(u => u.is_banned).length}</p>
                                <p className="text-xs text-muted-foreground">Banned on this page</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                    <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" size="sm" variant="secondary">Search</Button>
                    </form>
                    <div className="flex items-center gap-1.5">
                        {(['all', 'active', 'banned'] as const).map((s) => (
                            <Button
                                key={s}
                                size="sm"
                                variant={(activeFilter === s || (activeFilter !== 'active' && activeFilter !== 'banned' && s === 'all')) ? 'default' : 'outline'}
                                onClick={() => router.get('/admin/users', { status: s === 'all' ? '' : s }, { preserveScroll: true })}
                            >
                                {s === 'all' ? 'All' : s === 'banned' ? 'Banned' : 'Active'}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader className="py-3 px-4 border-b">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {users.total} user{users.total !== 1 ? 's' : ''} found
                        </CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Orders</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                                            <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                            <p>No users found.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => {
                                        const roleKey = user.is_admin ? 'admin' : user.role;
                                        const roleCfg = ROLE_CONFIG[roleKey] ?? ROLE_CONFIG['buyer'];
                                        return (
                                            <TableRow
                                                key={user.id}
                                                className={user.is_banned ? 'opacity-50 bg-red-50/30 dark:bg-red-950/10' : 'hover:bg-muted/30'}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 shrink-0">
                                                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-sm truncate">{user.name}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`text-xs ${roleCfg.className}`}>
                                                        {user.is_admin && <ShieldCheck className="h-3 w-3 mr-1" />}
                                                        {roleCfg.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">{user.order_count ?? 0}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell>
                                                    {user.is_banned ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                                                            <UserX className="h-3.5 w-3.5" /> Banned
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                                            <CheckCircle2 className="h-3.5 w-3.5" /> Active
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {!user.is_admin && user.role !== 'admin' && (
                                                        user.is_banned ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUnban(user)}
                                                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                                                Unban
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleBan(user)}
                                                                className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                            >
                                                                <Ban className="h-3.5 w-3.5 mr-1" />
                                                                Ban
                                                            </Button>
                                                        )
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-center gap-1.5 border-t px-6 py-3">
                            {users.links.map((link, idx) => (
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
