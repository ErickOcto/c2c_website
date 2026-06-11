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
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AdminLayout } from '@/layouts/admin-layout';

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

    function handleBan(user: User) {
        if (!window.confirm(`Ban "${user.name}"? They will lose access to the platform.`)) return;
        router.patch(`/admin/users/${user.id}/ban`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success(`${user.name} has been banned.`),
            onError: () => toast.error('Failed to ban user.'),
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
