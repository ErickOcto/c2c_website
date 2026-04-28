import { usePage, router } from '@inertiajs/react';
import { useEchoNotification } from '@laravel/echo-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function GlobalNotificationListener() {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;

    useEchoNotification(
        auth?.user ? `App.Models.User.${auth.user.id}` : '',
        (notification: any) => {
            if (!auth?.user) return;

            // Show toast
            toast(notification.title || 'New Notification', {
                description: notification.message || 'You have received a new notification.',
                action: notification.url ? {
                    label: 'View',
                    onClick: () => router.visit(notification.url)
                } : undefined
            });

            // Reload auth props to update unread counts and recent notifications
            router.reload({ only: ['auth'] });
        }
    );

    return null;
}
