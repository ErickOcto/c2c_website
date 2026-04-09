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
import type { Product, PaginationLink } from '@/types';

type PaginatedProducts = {
    data: Product[];
    current_page: number;
    last_page: number;
    total: number;
    links: PaginationLink[];
};

type Props = {
    products: PaginatedProducts;
};

const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
    sold: { label: 'Sold', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    deleted: { label: 'Deleted', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const conditionLabels: Record<string, string> = {
    new: 'New',
    good: 'Good',
    bad: 'Fair',
    poor: 'Poor',
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

function handleToggle(productId: number) {
    router.patch(`/seller/products/${productId}/toggle`, {}, {
        preserveScroll: true,
    });
}

function handleDelete(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
        router.delete(`/seller/products/${productId}`, {
            preserveScroll: true,
        });
    }
}

export default function SellerProducts({ products }: Props) {
    return (
        <>
            <Head title="My Products" />

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Products</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your product listings
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/seller/products/create">
                            + New Product
                        </Link>
                    </Button>
                </div>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {products.total} product{products.total !== 1 ? 's' : ''}
                        </CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Condition</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-center">Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12">
                                            <div className="space-y-3">
                                                <p className="text-muted-foreground">
                                                    You haven't listed any products yet.
                                                </p>
                                                <Button asChild>
                                                    <Link href="/seller/products/create">
                                                        List Your First Product
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="h-12 w-12 overflow-hidden rounded-md border bg-muted">
                                                    {product.images?.[0] ? (
                                                        <img
                                                            src={product.images[0].image_url}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                            No img
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm line-clamp-1">
                                                        {product.name}
                                                    </p>
                                                    {product.brand && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {product.brand}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {product.category?.name ?? '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                    {conditionLabels[product.condition] ?? product.condition}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold tabular-nums">
                                                {formatCurrency(product.price)}
                                            </TableCell>
                                            <TableCell className="text-center tabular-nums">
                                                {product.stock}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[product.status]?.color ?? 'bg-gray-100 text-gray-800'}`}>
                                                    {statusConfig[product.status]?.label ?? product.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/seller/products/${product.id}/edit`}>
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    {product.status !== 'deleted' && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleToggle(product.id)}
                                                            >
                                                                {product.status === 'active' ? 'Deactivate' : 'Activate'}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => handleDelete(product.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 border-t px-6 py-4">
                            {products.links.map((link, idx) => (
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
