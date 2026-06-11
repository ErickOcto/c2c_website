<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user?->is_admin && ! ($user?->role === 'admin')) {
            abort(403, 'Access denied. Admin only.');
        }

        return $next($request);
    }
}
