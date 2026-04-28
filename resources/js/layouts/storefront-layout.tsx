import { StorefrontHeader } from '@/components/storefront-header';
import { StorefrontFooter } from '@/components/storefront-footer';
import { GlobalNotificationListener } from '@/components/global-notification-listener';

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <GlobalNotificationListener />
            <StorefrontHeader />
            <main className="flex-1">{children}</main>
            <StorefrontFooter />
        </div>
    );
}
