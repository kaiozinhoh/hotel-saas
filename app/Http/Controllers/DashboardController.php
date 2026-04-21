<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Payment;
use App\Models\Consumption;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->role === 'admin';

        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        // Obter hotéis do usuário e hotel atual
        $hotels = $user->activeHotels()->withCount('rooms', 'reservations')->get();
        $currentHotel = $user->getCurrentHotel();

        // Filtrar por hotel atual se existir
        $totalRooms = Room::forCurrentHotel()->count();

        $occupiedRooms = Room::forCurrentHotel()->whereHas('reservations', function($q) use ($today) {
            $q->whereIn('status', ['confirmed', 'checked_in'])
              ->where('check_in', '<=', $today)
              ->where('check_out', '>', $today);
        })->count();

        $occupancyRate = $totalRooms > 0 ? ($occupiedRooms / $totalRooms) * 100 : 0;

        $revenueMonth = 0;

        if ($isAdmin) {
            $revenueMonth = Payment::where('status', 'paid')
                ->where('paid_at', '>=', $startOfMonth)
                ->forCurrentHotel()
                ->sum('amount');
        }

        $topProducts = Consumption::select('product_id', DB::raw('sum(quantity) as total_qty'))
            ->forCurrentHotel()
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->take(5)
            ->with('product')
            ->get();

        $recentReservations = Reservation::with(['guest', 'room'])
            ->forCurrentHotel()
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'occupancyRate' => round($occupancyRate, 1),
                'occupiedRooms' => $occupiedRooms,
                'totalRooms' => $totalRooms,
                'revenueMonth' => $revenueMonth,
                'checkinsToday' => Reservation::whereDate('check_in', $today)
                    ->where('status', '!=', 'cancelled')
                    ->forCurrentHotel()
                    ->count(),
            ],
            'topProducts' => $topProducts,
            'recentReservations' => $recentReservations,
            'hotels' => $hotels,
            'currentHotel' => $currentHotel,
            'currentHotelId' => session('current_hotel_id')
        ]);
    }
}
