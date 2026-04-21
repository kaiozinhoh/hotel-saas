<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        // Se não for admin, retorna erro 403 (Proibido)
        if ($request->user()->role !== 'admin') {
            abort(403, 'Acesso restrito ao administrador.');
        }

        return $next($request);
    }
}
