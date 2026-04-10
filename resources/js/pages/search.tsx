import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Product, Category, PaginatedProducts } from '@/types';
import { ProductCard } from '@/components/product-card';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Search as SearchIcon,
    SlidersHorizontal,
    X,
    PackageOpen,
} from 'lucide-react';

type Filters = {
    q?: string;
    department?: string;
    category?: string;
    condition?: string;
    min_price?: string;
    max_price?: string;
    size?: string;
    brand?: string;
    sort?: string;
};

type Props = {
    products: PaginatedProducts;
    categories: Category[];
    filters: Filters;
};

const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'good', label: 'Good' },
    { value: 'bad', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42'];

export default function SearchPage({
    products,
    categories,
    filters,
}: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.q ?? '');
    const [isLoading, setIsLoading] = useState(false);
    const [localFilters, setLocalFilters] = useState<Filters>(filters);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    const applyFilters = useCallback(
        (newFilters: Filters) => {
            const cleanFilters: Record<string, string> = {};
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value && value !== '') {
                    cleanFilters[key] = value;
                }
            });

            setIsLoading(true);
            router.get('/search', cleanFilters, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            });
        },
        [],
    );

    // Debounced search — waits 1 second after user stops typing
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            applyFilters({ ...localFilters, q: searchQuery });
        }, 1000);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery]);

    function handleFilterChange(key: keyof Filters, value: string) {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        applyFilters({ ...newFilters, q: searchQuery });
    }

    function clearFilter(key: keyof Filters) {
        const newFilters = { ...localFilters };
        delete newFilters[key];
        setLocalFilters(newFilters);
        applyFilters({ ...newFilters, q: searchQuery });
    }

    function clearAllFilters() {
        setSearchQuery('');
        setLocalFilters({});
        applyFilters({});
    }

    const activeFilterCount = Object.entries(localFilters).filter(
        ([key, value]) => key !== 'q' && key !== 'sort' && value,
    ).length;

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Categories */}
            <div>
                <h3 className="font-semibold text-sm mb-3">Category</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`cat-${cat.id}`}
                                checked={localFilters.category === String(cat.id)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        handleFilterChange('category', String(cat.id));
                                    } else {
                                        clearFilter('category');
                                    }
                                }}
                            />
                            <Label
                                htmlFor={`cat-${cat.id}`}
                                className="text-sm cursor-pointer"
                            >
                                {cat.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Condition */}
            <div>
                <h3 className="font-semibold text-sm mb-3">Condition</h3>
                <div className="space-y-2">
                    {conditionOptions.map((opt) => (
                        <div key={opt.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`cond-${opt.value}`}
                                checked={localFilters.condition === opt.value}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        handleFilterChange('condition', opt.value);
                                    } else {
                                        clearFilter('condition');
                                    }
                                }}
                            />
                            <Label
                                htmlFor={`cond-${opt.value}`}
                                className="text-sm cursor-pointer"
                            >
                                {opt.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
                <h3 className="font-semibold text-sm mb-3">Price Range</h3>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={localFilters.min_price ?? ''}
                        onChange={(e) =>
                            handleFilterChange('min_price', e.target.value)
                        }
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    />
                    <span className="flex items-center text-muted-foreground">
                        –
                    </span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={localFilters.max_price ?? ''}
                        onChange={(e) =>
                            handleFilterChange('max_price', e.target.value)
                        }
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    />
                </div>
            </div>

            <Separator />

            {/* Size */}
            <div>
                <h3 className="font-semibold text-sm mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                        <button
                            key={size}
                            onClick={() => {
                                if (localFilters.size === size) {
                                    clearFilter('size');
                                } else {
                                    handleFilterChange('size', size);
                                }
                            }}
                            className={`h-8 min-w-[40px] px-2 rounded-md border text-xs font-medium transition-all ${
                                localFilters.size === size
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'border-input hover:border-primary/50 bg-background'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {activeFilterCount > 0 && (
                <>
                    <Separator />
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearAllFilters}
                    >
                        Clear All Filters
                    </Button>
                </>
            )}
        </div>
    );

    return (
        <>
            <Head title={filters.q ? `Search: ${filters.q}` : 'Search'} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-2xl mx-auto">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search for fashion items, brands..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 rounded-full border border-input bg-background pl-12 pr-12 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    applyFilters({ ...localFilters, q: '' });
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Active Filters */}
                {(activeFilterCount > 0 || searchQuery) && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-sm text-muted-foreground">
                            Active filters:
                        </span>
                        {searchQuery && (
                            <Badge variant="secondary" className="gap-1">
                                &quot;{searchQuery}&quot;
                                <button onClick={() => {
                                    setSearchQuery('');
                                    applyFilters({ ...localFilters, q: '' });
                                }}>
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}
                        {localFilters.department && (
                            <Badge variant="secondary" className="gap-1 capitalize">
                                {localFilters.department}
                                <button onClick={() => clearFilter('department')}>
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}
                        {localFilters.category && (
                            <Badge variant="secondary" className="gap-1">
                                {categories.find(
                                    (c) => String(c.id) === localFilters.category,
                                )?.name ?? 'Category'}
                                <button onClick={() => clearFilter('category')}>
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}
                        {localFilters.condition && (
                            <Badge variant="secondary" className="gap-1">
                                {conditionOptions.find(
                                    (c) => c.value === localFilters.condition,
                                )?.label}
                                <button onClick={() => clearFilter('condition')}>
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}
                        {localFilters.size && (
                            <Badge variant="secondary" className="gap-1">
                                Size: {localFilters.size}
                                <button onClick={() => clearFilter('size')}>
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}
                    </div>
                )}

                <div className="flex gap-8">
                    {/* Desktop Filter Sidebar */}
                    <aside className="hidden lg:block w-56 shrink-0">
                        <Card>
                            <CardContent className="p-4">
                                <h2 className="font-semibold mb-4 flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filters
                                </h2>
                                <FilterContent />
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                {/* Mobile filter button */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="lg:hidden"
                                        >
                                            <SlidersHorizontal className="h-4 w-4 mr-1" />
                                            Filters
                                            {activeFilterCount > 0 && (
                                                <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                                    {activeFilterCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80 overflow-y-auto">
                                        <SheetHeader>
                                            <SheetTitle>Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-4">
                                            <FilterContent />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <p className="text-sm text-muted-foreground">
                                    {isLoading
                                        ? 'Searching...'
                                        : `${products.total} result${products.total !== 1 ? 's' : ''}`}
                                </p>
                            </div>

                            {/* Sort */}
                            <Select
                                value={localFilters.sort ?? 'newest'}
                                onValueChange={(value) =>
                                    handleFilterChange('sort', value)
                                }
                            >
                                <SelectTrigger className="w-40 h-9">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="price_asc">
                                        Price: Low to High
                                    </SelectItem>
                                    <SelectItem value="price_desc">
                                        Price: High to Low
                                    </SelectItem>
                                    <SelectItem value="popular">
                                        Most Popular
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Product Grid / Skeletons */}
                        {isLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                                {Array.from({ length: 8 }, (_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : products.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                                    {products.data.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="flex justify-center gap-1 mt-8">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url ?? '#'}
                                                className={`h-9 min-w-[36px] px-3 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : link.url
                                                          ? 'hover:bg-accent border border-input'
                                                          : 'opacity-50 cursor-not-allowed'
                                                }`}
                                                preserveState
                                                preserveScroll
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <PackageOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No items found
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                                    We couldn't find any items matching your
                                    search. Try adjusting your filters or
                                    searching for something else.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={clearAllFilters}
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
