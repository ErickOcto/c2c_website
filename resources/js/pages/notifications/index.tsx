import { Head, Link, router } from '@inertiajs/react';
import { Bell, BellOff, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import notificationsRoutes from '@/routes/notifications';

type NotificationData = {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: {
        title?: string;
        message?: string;
        url?: string;
    };
    read_at: string | null;
    created_at: string;
    updated_at: string;
};

type NotificationsProps = {
    notifications: {
        data: NotificationData[];
        current_page: number;
        last_page: number;
        links: any[];
    };
};

export default function NotificationsPage({ notifications }: NotificationsProps) {
    const items = notifications.data;

    function markAsRead(id: string) {
        router.patch(notificationsRoutes.markRead.url({ id }), {}, { preserveScroll: true });
    }

    function markAllAsRead() {
        router.post(notificationsRoutes.markAllRead.url(), {}, { preserveScroll: true });
    }

    function deleteNotification(id: string) {
        if (confirm('Are you sure you want to delete this notification?')) {
            router.delete(notificationsRoutes.destroy.url({ id }), { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Notifications" />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold font-heading tracking-tight">
                        Notifications
                    </h1>
                    {items.length > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllAsRead}>
                            <Check className="h-4 w-4 mr-2" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {items.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {items.map((notification) => (
                            <div 
                                key={notification.id} 
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${
                                    notification.read_at 
                                        ? 'bg-background border-border/50 opacity-70' 
                                        : 'bg-primary/5 border-primary/20 shadow-sm'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 flex-shrink-0 flex items-center justify-center size-10 rounded-full ${
                                        notification.read_at ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                                    }`}>
                                        <Bell className="size-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-base leading-tight">
                                                {notification.data.title || 'Notification'}
                                            </h3>
                                            {!notification.read_at && (
                                                <span className="flex size-2 rounded-full bg-primary shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {notification.data.message || 'You have a new notification.'}
                                        </p>
                                        <p className="text-xs text-muted-foreground/60 mt-2">
                                            {new Date(notification.created_at).toLocaleString(undefined, { 
                                                dateStyle: 'medium', 
                                                timeStyle: 'short' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    {notification.data.url && (
                                        <Link href={notification.data.url}>
                                            <Button variant="secondary" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    )}
                                    {!notification.read_at && (
                                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                            Mark as read
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => deleteNotification(notification.id)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {/* Pagination placeholder (can implement full pagination later if needed) */}
                        {notifications.last_page > 1 && (
                            <div className="mt-4 flex justify-center">
                                <p className="text-sm text-muted-foreground">
                                    Page {notifications.current_page} of {notifications.last_page}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <BellOff className="h-20 w-20 text-muted-foreground/20 mb-6" />
                        <h2 className="text-xl font-semibold mb-2">
                            No notifications yet
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-sm">
                            When you receive alerts, updates, or messages, they will appear here.
                        </p>
                        <Link href="/">
                            <Button
                                size="lg"
                                className="rounded-full px-8 font-semibold"
                            >
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
