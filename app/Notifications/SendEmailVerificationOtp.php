<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendEmailVerificationOtp extends Notification
{
    use Queueable;

    public function __construct(
        public string $code
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Verify Your Email — Your Code is '.$this->code)
            ->greeting('Hello!')
            ->line('Use the following 6-digit code to verify your email address:')
            ->line('**'.$this->code.'**')
            ->line('This code will expire in 10 minutes.')
            ->line('If you did not create an account, no further action is required.');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [];
    }
}
