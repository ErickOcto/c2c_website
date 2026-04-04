import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Separator } from './ui/separator';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

function generateBreadcrumbs(pathname: string): BreadcrumbItemType[] {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return [{ title: 'Home', href: '/' }];
    }

    const crumbs: BreadcrumbItemType[] = [{ title: 'Home', href: '/' }];

    segments.forEach((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const title = segment
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());

        crumbs.push({ title, href });
    });

    return crumbs;
}

export function AppSidebarHeader({
    breadcrumbs,
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { url } = usePage();
    const pathname = url.split('?')[0];

    const resolvedBreadcrumbs = useMemo(() => {
        if (breadcrumbs && breadcrumbs.length > 0) {
            return breadcrumbs;
        }
        return generateBreadcrumbs(pathname);
    }, [breadcrumbs, pathname]);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" />
                <Breadcrumbs breadcrumbs={resolvedBreadcrumbs} />
            </div>
        </header>
    );
}
