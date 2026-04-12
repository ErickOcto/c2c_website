<?php

namespace Modules\Transaction\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Midtrans\Config as MidtransConfig;
use Midtrans\Notification;
use Modules\Transaction\Models\Transaction;

class PaymentNotificationController extends Controller
{
    public function __construct()
    {
        MidtransConfig::$serverKey = config('midtrans.server_key');
        MidtransConfig::$isProduction = config('midtrans.is_production');
    }

    /**
     * Handle Midtrans payment webhook notification.
     */
    public function handle(Request $request): JsonResponse
    {
        try {
            $notification = new Notification;
        } catch (\Exception $e) {
            Log::error('Midtrans: Failed to instantiate notification', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Invalid notification'], 400);
        }

        $orderId = $notification->order_id;
        $transactionStatus = $notification->transaction_status;
        $fraudStatus = $notification->fraud_status;
        $paymentType = $notification->payment_type;

        Log::info('Midtrans webhook received', [
            'order_id' => $orderId,
            'status' => $transactionStatus,
            'fraud' => $fraudStatus,
            'payment_type' => $paymentType,
        ]);

        // Extract transaction ID from order_id format: TXN-{id}-{timestamp}
        $transactionId = $this->extractTransactionId($orderId);

        if (! $transactionId) {
            Log::error('Midtrans: Could not extract transaction ID', [
                'order_id' => $orderId,
            ]);

            return response()->json(['error' => 'Invalid order ID format'], 400);
        }

        $transaction = Transaction::find($transactionId);

        if (! $transaction) {
            Log::error('Midtrans: Transaction not found', [
                'transaction_id' => $transactionId,
            ]);

            return response()->json(['error' => 'Transaction not found'], 404);
        }

        // Verify the signature key
        $signatureKey = hash('sha512',
            $orderId .
            $notification->status_code .
            $notification->gross_amount .
            config('midtrans.server_key')
        );

        if ($signatureKey !== $notification->signature_key) {
            Log::warning('Midtrans: Invalid signature', [
                'order_id' => $orderId,
            ]);

            return response()->json(['error' => 'Invalid signature'], 403);
        }

        // Process based on transaction status
        $this->processNotification($transaction, $transactionStatus, $fraudStatus, $paymentType);

        return response()->json(['status' => 'ok']);
    }

    /**
     * Process the payment notification and update statuses.
     */
    private function processNotification(
        Transaction $transaction,
        string $transactionStatus,
        ?string $fraudStatus,
        string $paymentType,
    ): void {
        $transaction->update(['payment_method' => $paymentType]);

        switch ($transactionStatus) {
            case 'capture':
                // For credit card: check fraud status
                if ($fraudStatus === 'accept') {
                    $this->markAsPaid($transaction);
                } elseif ($fraudStatus === 'challenge') {
                    $transaction->update(['payment_status' => 'challenge']);
                }
                break;

            case 'settlement':
                $this->markAsPaid($transaction);
                break;

            case 'pending':
                $transaction->update(['payment_status' => 'pending']);
                break;

            case 'deny':
            case 'cancel':
                $this->markAsCancelled($transaction);
                break;

            case 'expire':
                $this->markAsExpired($transaction);
                break;

            default:
                Log::warning('Midtrans: Unhandled transaction status', [
                    'status' => $transactionStatus,
                    'transaction_id' => $transaction->id,
                ]);
                break;
        }
    }

    /**
     * Mark transaction and all related orders as paid.
     */
    private function markAsPaid(Transaction $transaction): void
    {
        $transaction->update([
            'payment_status' => 'paid',
            'paid_at' => now(),
        ]);

        $transaction->orders()->update(['status' => 'paid']);

        Log::info('Midtrans: Transaction marked as paid', [
            'transaction_id' => $transaction->id,
        ]);
    }

    /**
     * Mark transaction and all related orders as cancelled.
     */
    private function markAsCancelled(Transaction $transaction): void
    {
        $transaction->update(['payment_status' => 'cancelled']);
        $transaction->orders()->update(['status' => 'cancelled']);

        Log::info('Midtrans: Transaction cancelled', [
            'transaction_id' => $transaction->id,
        ]);
    }

    /**
     * Mark transaction and all related orders as expired.
     */
    private function markAsExpired(Transaction $transaction): void
    {
        $transaction->update(['payment_status' => 'expired']);
        $transaction->orders()->update(['status' => 'cancelled']);

        Log::info('Midtrans: Transaction expired', [
            'transaction_id' => $transaction->id,
        ]);
    }

    /**
     * Extract transaction ID from Midtrans order_id.
     * Format: TXN-{id}-{timestamp}
     */
    private function extractTransactionId(string $orderId): ?int
    {
        if (preg_match('/^TXN-(\d+)-/', $orderId, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }
}
