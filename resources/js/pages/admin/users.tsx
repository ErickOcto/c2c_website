import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
    LayoutDashboard,
    Users,
    Flag,
    LogOut,
    ShieldCheck,
    Search,
    Ban,
    CheckCircle2,
    UserX,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type User = {
    id: number;
    name: string;
    email: string;
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

const navItems = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/reports', label: 'Reports', icon: Flag },
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

export default function AdminUsers({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.q ?? '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/users', { q: search }, { preserveScroll: true });
    }

    function handleBan(user: User) {
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

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar activePath="/admin/users" />

            <div className="flex-1 flex flex-col min-w-0">
                <Head title="User Management — Admin" />
                <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight">User Management</h1>
                    <Badge variant="outline" className="gap-1 text-primary border-primary/30">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Admin
                    </Badge>
                </header>

                <main className="flex-1 p-6 space-y-5 overflow-y-auto">
                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-sm">
                            <Input
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button type="submit" size="icon" variant="outline">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                        <div className="flex items-center gap-2">
                            {(['all', 'active', 'banned'] as const).map((s) => (
                                <Button
                                    key={s}
                                    size="sm"
                                    variant={filters.status === s || (!filters.status && s === 'all') ? 'default' : 'outline'}
                                    onClick={() => router.get('/admin/users', { status: s === 'all' ? '' : s }, { preserveScroll: true })}
                                >
                                    {s === 'all' ? 'All Users' : s === 'banned' ? 'Banned' : 'Active'}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">{users.total} user{users.total !== 1 ? 's' : ''} found</CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
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
                                            <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user) => (
                                            <TableRow key={user.id} className={user.is_banned ? 'opacity-60' : ''}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                                                {user.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium text-sm">{user.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                                                <TableCell>
                                                    {user.is_admin ? (
                                                        <Badge className="bg-primary/10 text-primary border-primary/20">Admin</Badge>
                                                    ) : (
                                                        <Badge variant="outline">User</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">{user.order_count ?? 0}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {user.is_banned ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                                                            <UserX className="h-3.5 w-3.5" /> Banned
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                                            <CheckCircle2 className="h-3.5 w-3.5" /> Active
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {!user.is_admin && (
                                                        user.is_banned ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUnban(user)}
                                                                className="text-green-600 border-green-200 hover:bg-green-50"
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                                                Unban
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleBan(user)}
                                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                            >
                                                                <Ban className="h-3.5 w-3.5 mr-1" />
                                                                Ban
                                                            </Button>
                                                        )
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 border-t px-6 py-4">
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
                </main>
            </div>
        </div>
    );
}
