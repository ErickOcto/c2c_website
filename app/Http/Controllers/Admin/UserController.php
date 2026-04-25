<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::withCount(['orders as order_count'])
            ->with('profile');

        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->input('q').'%')
                    ->orWhere('email', 'like', '%'.$request->input('q').'%');
            });
        }

        if ($request->filled('status')) {
            $query->where('is_banned', $request->input('status') === 'banned');
        }

        $users = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/users', [
            'users' => $users,
            'filters' => $request->only(['q', 'status']),
        ]);
    }

    public function ban(Request $request, User $user): RedirectResponse
    {
        if ($user->is_admin) {
            return back()->withErrors(['ban' => 'Cannot ban an admin user.']);
        }

        $user->update(['is_banned' => true]);

        return back()->with('status', "User {$user->name} has been banned.");
    }

    public function unban(Request $request, User $user): RedirectResponse
    {
        $user->update(['is_banned' => false]);

        return back()->with('status', "User {$user->name} has been unbanned.");
    }
}
