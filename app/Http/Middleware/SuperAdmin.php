<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || $user->role !== 'super_admin') {
            abort(403, 'Acesso negado. Apenas Super Administradores podem acessar esta área.');
        }

        return $next($request);
    }
}
