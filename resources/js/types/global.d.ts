import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}

// Midtrans Snap.js global
interface SnapResult {
    order_id: string;
    transaction_status: string;
    fraud_status: string;
}

interface Window {
    snap: {
        pay: (
            token: string,
            options?: {
                onSuccess?: (result: SnapResult) => void;
                onPending?: (result: SnapResult) => void;
                onError?: (result: SnapResult) => void;
                onClose?: () => void;
            },
        ) => void;
    };
}
