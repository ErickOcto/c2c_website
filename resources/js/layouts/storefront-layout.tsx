import { StorefrontHeader } from '@/components/storefront-header';
import { StorefrontFooter } from '@/components/storefront-footer';

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <StorefrontHeader />
            <main className="flex-1">{children}</main>
            <StorefrontFooter />
        </div>
    );
}
