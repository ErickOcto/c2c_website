<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\SystemNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_notifications_page(): void
    {
        $response = $this->get(route('notifications.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_access_notifications_page(): void
    {
        $this->actingAs($this->user);

        // Notify user
        $this->user->notify(new SystemNotification('System Update', 'New features are here!', '/dashboard'));

        $response = $this->get(route('notifications.index'));
        $response->assertOk();

        // Check it contains notifications prop
        $response->assertInertia(fn ($page) => $page
            ->component('notifications/index')
            ->has('notifications.data', 1)
            ->where('notifications.data.0.data.title', 'System Update')
        );
    }

    public function test_can_mark_notification_as_read(): void
    {
        $this->actingAs($this->user);

        $this->user->notify(new SystemNotification('Unread Notif', 'Mark me read please.'));
        $notification = $this->user->unreadNotifications->first();

        $this->assertNotNull($notification);
        $this->assertNull($notification->read_at);

        $response = $this->patch(route('notifications.mark-read', ['id' => $notification->id]));
        $response->assertRedirect();

        $notification->refresh();
        $this->assertNotNull($notification->read_at);
    }

    public function test_can_mark_all_notifications_as_read(): void
    {
        $this->actingAs($this->user);

        $this->user->notify(new SystemNotification('Notif 1', 'Unread 1'));
        $this->user->notify(new SystemNotification('Notif 2', 'Unread 2'));

        $this->assertEquals(2, $this->user->unreadNotifications()->count());

        $response = $this->post(route('notifications.mark-all-read'));
        $response->assertRedirect();

        $this->assertEquals(0, $this->user->unreadNotifications()->count());
    }

    public function test_can_delete_notification(): void
    {
        $this->actingAs($this->user);

        $this->user->notify(new SystemNotification('ToDelete', 'Delete me please.'));
        $notification = $this->user->notifications()->first();

        $this->assertNotNull($notification);

        $response = $this->delete(route('notifications.destroy', ['id' => $notification->id]));
        $response->assertRedirect();

        $this->assertNull($this->user->notifications()->find($notification->id));
    }
}
