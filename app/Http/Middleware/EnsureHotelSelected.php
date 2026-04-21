<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHotelSelected
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Se for super admin (sem hotéis específicos), permitir
        if ($user && $user->role === 'super_admin') {
            return $next($request);
        }

        // Verificar se o usuário tem hotéis disponíveis
        if ($user && $user->activeHotels()->count() === 0) {
            return redirect()->route('hotels.index')
                ->with('error', 'Você não tem acesso a nenhum hotel. Contate o administrador.');
        }

        // Verificar se tem hotel selecionado na sessão
        if ($user && !session('current_hotel_id')) {
            $firstHotel = $user->activeHotels()->first();
            if ($firstHotel) {
                session(['current_hotel_id' => $firstHotel->id]);
            }
        }

        // Verificar se o hotel selecionado ainda é válido
        if ($user && session('current_hotel_id')) {
            $hotel = $user->activeHotels()->find(session('current_hotel_id'));
            if (!$hotel) {
                $firstHotel = $user->activeHotels()->first();
                if ($firstHotel) {
                    session(['current_hotel_id' => $firstHotel->id]);
                } else {
                    return redirect()->route('hotels.index')
                        ->with('error', 'Seu acesso ao hotel atual foi revogado. Selecione outro hotel.');
                }
            }
        }

        return $next($request);
    }
}
