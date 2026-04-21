<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        // 1. Define o Mês/Ano (Padrão: Atual)
        $date = $request->input('date') ? Carbon::parse($request->input('date')) : Carbon::now();

        $startOfMonth = $date->copy()->startOfMonth()->format('Y-m-d');
        $endOfMonth   = $date->copy()->endOfMonth()->format('Y-m-d');

        // 2. Busca Quartos com Reservas que tocam neste mês
        $rooms = Room::with(['reservations' => function ($query) use ($startOfMonth, $endOfMonth) {
            $query->where('status', '!=', 'cancelled')
                  // Lógica Otimizada de Colisão de Datas:
                  // Uma reserva colide com o mês se:
                  // (DataEntrada < FimDoMes) E (DataSaida > InicioDoMes)
                  ->where('check_in', '<=', $endOfMonth)
                  ->where('check_out', '>=', $startOfMonth)
                  ->with('guest:id,name'); // Traz apenas nome e id do hóspede (Performance)
        }])->orderBy('number')->get();

        return Inertia::render('Calendar/Index', [
            'rooms' => $rooms,
            'currentDate' => $date->format('Y-m-d'),
            'daysInMonth' => $date->daysInMonth
        ]);
    }
}
