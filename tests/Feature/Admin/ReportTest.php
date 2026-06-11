<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Feedback\Models\Report;
use Modules\Product\Models\Product;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $user;

    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->user = User::factory()->create(['is_admin' => false]);
        $this->product = Product::factory()->create(['user_id' => $this->user->id]);
    }

    public function test_guests_cannot_view_reports(): void
    {
        $response = $this->get(route('admin.reports.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_non_admins_cannot_view_reports(): void
    {
        $this->actingAs($this->user);
        $response = $this->get(route('admin.reports.index'));
        $response->assertForbidden();
    }

    public function test_admins_can_view_reports(): void
    {
        $this->actingAs($this->admin);

        Report::create([
            'reporter_id' => $this->user->id,
            'product_id' => $this->product->id,
            'reason' => 'Inappropriate content',
            'description' => 'This listing violates safety policies.',
            'status' => 'pending',
        ]);

        $response = $this->get(route('admin.reports.index'));
        $response->assertOk();
    }

    public function test_admins_can_update_report_status(): void
    {
        $this->actingAs($this->admin);

        $report = Report::create([
            'reporter_id' => $this->user->id,
            'product_id' => $this->product->id,
            'reason' => 'Inappropriate content',
            'description' => 'This listing violates safety policies.',
            'status' => 'pending',
        ]);

        // Test review status update
        $response = $this->patch(route('admin.reports.update-status', $report), [
            'status' => 'reviewed',
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'status' => 'reviewed',
        ]);

        // Test dismissed status update (our critical fix)
        $response = $this->patch(route('admin.reports.update-status', $report), [
            'status' => 'dismissed',
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'status' => 'dismissed',
        ]);
    }

    public function test_admins_can_remove_product_and_resolve_report(): void
    {
        $this->actingAs($this->admin);

        $report = Report::create([
            'reporter_id' => $this->user->id,
            'product_id' => $this->product->id,
            'reason' => 'Inappropriate content',
            'description' => 'This listing violates safety policies.',
            'status' => 'pending',
        ]);

        $response = $this->post(route('admin.reports.remove-product', $report));
        $response->assertRedirect();

        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'status' => 'resolved',
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $this->product->id,
            'status' => 'inactive',
        ]);
    }
}
