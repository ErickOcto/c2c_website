import { useState, useRef, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from '@/components/ui/input-otp';
import InputError from '@/components/input-error';

type Props = {
    status?: string;
    email: string;
};

export default function VerifyEmail({ status, email }: Props) {
    const [code, setCode] = useState('');
    const [processing, setProcessing] = useState(false);
    const [resending, setResending] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleVerify = useCallback(() => {
        if (code.length !== 6) return;

        setProcessing(true);
        setErrors({});

        router.post(
            '/email/verify-otp',
            { code },
            {
                onError: (errs) => {
                    setErrors(errs as Record<string, string>);
                    setProcessing(false);
                },
                onFinish: () => setProcessing(false),
            },
        );
    }, [code]);

    const handleResend = useCallback(() => {
        setResending(true);
        setErrors({});

        router.post(
            '/email/resend-otp',
            {},
            {
                onFinish: () => setResending(false),
            },
        );
    }, []);

    return (
        <>
            <Head title="Verify Email" />

            <div className="space-y-6 text-center">
                <p className="text-sm text-muted-foreground">
                    We sent a 6-digit verification code to{' '}
                    <span className="font-medium text-foreground">{email}</span>.
                    <br />
                    Enter the code below to verify your account.
                </p>

                {status && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
                        {status}
                    </div>
                )}

                <div className="flex justify-center">
                    <InputOTP
                        maxLength={6}
                        value={code}
                        onChange={(value) => setCode(value)}
                        onComplete={handleVerify}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className="size-12 text-lg" />
                            <InputOTPSlot index={1} className="size-12 text-lg" />
                            <InputOTPSlot index={2} className="size-12 text-lg" />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} className="size-12 text-lg" />
                            <InputOTPSlot index={4} className="size-12 text-lg" />
                            <InputOTPSlot index={5} className="size-12 text-lg" />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                {errors.code && (
                    <InputError message={errors.code} className="text-center" />
                )}

                <Button
                    onClick={handleVerify}
                    disabled={processing || code.length !== 6}
                    className="w-full"
                    data-test="verify-otp-button"
                >
                    {processing && <Spinner />}
                    Verify
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>Didn't receive the code?</span>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="font-medium text-foreground underline underline-offset-4 hover:text-primary disabled:opacity-50"
                    >
                        {resending ? 'Sending...' : 'Resend'}
                    </button>
                </div>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verify Your Email',
    description: 'Enter the 6-digit verification code sent to your email',
};
