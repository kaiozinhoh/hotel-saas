<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Payment;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;



class FinancialController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Você não tem permissão para acessar o financeiro.');
        }

        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // 1. KPI: Faturamento (Pagamentos Confirmados)
        $monthlyRevenue = Payment::where('status', 'paid')
            ->whereBetween('paid_at', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        // 2. KPI: Despesas
        $monthlyExpenses = Expense::whereNotNull('paid_at')
            ->whereBetween('paid_at', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        // 3. KPI: Lucro Líquido
        $monthlyProfit = $monthlyRevenue - $monthlyExpenses;

        // 4. KPI: Taxa de Ocupação Atual (Cálculo Dinâmico para precisão)
        $totalRooms = Room::count();
        $occupiedRooms = Room::whereHas('reservations', function($q) {
            $q->whereIn('status', ['confirmed', 'checked_in'])
              ->where('check_in', '<=', now())
              ->where('check_out', '>', now());
        })->count();

        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100) : 0;

        return Inertia::render('Financial/Dashboard', [
            'kpis' => [
                'revenue' => $monthlyRevenue,
                'expenses' => $monthlyExpenses,
                'profit' => $monthlyProfit,
                'occupancy' => $occupancyRate
            ],
            'chartData' => $this->getChartData(),
            'recentTransactions' => Payment::with(['reservation.guest', 'method'])
                ->where('status', 'paid')
                ->latest('paid_at')
                ->take(5)
                ->get()
                ->map(fn($p) => [
                    'id' => $p->id,
                    'guest' => $p->reservation->guest->name ?? 'Avulso',
                    'amount' => $p->amount,
                    'method' => $p->method->name ?? '-',
                    'date' => Carbon::parse($p->paid_at)->format('d/m H:i'),
                ])
        ]);
    }

    private function getChartData()
    {
        $data = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $month = $date->month;
            $year = $date->year;

            $revenue = Payment::where('status', 'paid')
                ->whereMonth('paid_at', $month)->whereYear('paid_at', $year)
                ->sum('amount');

            $expenses = Expense::whereNotNull('paid_at')
                ->whereMonth('paid_at', $month)->whereYear('paid_at', $year)
                ->sum('amount');

            $data[] = [
                'name' => $date->format('M/y'), // Ex: Fev/26
                'Receita' => (float) $revenue,
                'Despesa' => (float) $expenses
            ];
        }
        return $data;
    }
}
