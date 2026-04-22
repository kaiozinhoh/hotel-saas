<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Hotel;
use Symfony\Component\HttpFoundation\Response;

class HotelSubdomain
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Obter o subdomínio da requisição
        $host = $request->getHost();
        $subdomain = explode('.', $host)[0] ?? null;
        
        // Se for www ou não tiver subdomínio, é painel admin
        if ($subdomain === 'www' || !$subdomain || $host === 'exchangesistemas.com.br') {
            // Definir que estamos no painel admin
            session(['context' => 'admin']);
            return $next($request);
        }
        
        // Tentar encontrar o hotel pelo subdomínio
        $hotel = Hotel::where('subdomain', $subdomain)->first();
        
        if (!$hotel) {
            // Hotel não encontrado, redirecionar para página principal
            return redirect('https://www.exchangesistemas.com.br');
        }
        
        // Definir hotel atual no contexto
        session(['current_hotel_id' => $hotel->id]);
        session(['context' => 'hotel']);
        
        // Compartilhar hotel em todas as views
        view()->share('current_hotel', $hotel);
        
        // Adicionar header para identificação (útil para proxy)
        $request->headers->set('X-Hotel-ID', $hotel->id);
        $request->headers->set('X-Hotel-Subdomain', $hotel->subdomain);
        
        return $next($request);
    }
}
