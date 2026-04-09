<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\UserOtp;
use App\Notifications\SendEmailVerificationOtp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OtpVerificationController extends Controller
{
    /**
     * Display the OTP verification page.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(config('fortify.home'));
        }

        return Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
            'email' => $request->user()->email,
        ]);
    }

    /**
     * Verify the submitted OTP code.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(config('fortify.home'));
        }

        $otp = UserOtp::where('user_id', $user->id)
            ->where('code', $request->input('code'))
            ->first();

        if (! $otp || $otp->isExpired()) {
            return back()->withErrors([
                'code' => $otp ? 'The verification code has expired. Please request a new one.' : 'Invalid verification code.',
            ]);
        }

        $user->markEmailAsVerified();
        $otp->delete();

        return redirect()->intended(config('fortify.home'))->with('status', 'Email verified successfully!');
    }

    /**
     * Resend the OTP code.
     */
    public function resend(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(config('fortify.home'));
        }

        $otp = UserOtp::generateFor($user);
        $user->notify(new SendEmailVerificationOtp($otp->code));

        return back()->with('status', 'A new verification code has been sent to your email.');
    }
}
