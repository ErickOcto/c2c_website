import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden border-0 bg-card shadow-sm">
            <div className="relative aspect-3/4 overflow-hidden">
                <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-5 w-24" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </CardContent>
        </Card>
    );
}
