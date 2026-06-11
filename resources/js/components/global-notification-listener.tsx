import { usePage, router } from '@inertiajs/react';
import { useEchoNotification } from '@laravel/echo-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function GlobalNotificationListener() {
    // 1. TAMBAHKAN BARIS INI UNTUK MEMATIKAN FITUR NOTIFIKASI SEMENTARA
    return null;

    // Kode di bawah ini tidak akan dieksekusi, jadi aplikasi tidak akan crash lagi
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;

    useEchoNotification(
        auth?.user ? `App.Models.User.${auth.user.id}` : '',
        (notification: any) => {
            if (!auth?.user) return;

            toast(notification.title || 'New Notification', {
                description: notification.message || 'You have received a new notification.',
                action: notification.url ? {
                    label: 'View',
                    onClick: () => router.visit(notification.url)
                } : undefined
            });

            router.reload({ only: ['auth'] });
        }
    );

    return null;
}