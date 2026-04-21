<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotelController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $hotels = $user->activeHotels()->withCount('rooms', 'reservations')->get();
        $currentHotel = $user->getCurrentHotel();

        return Inertia::render('Hotels/Index', [
            'hotels' => $hotels,
            'currentHotel' => $currentHotel,
            'currentHotelId' => session('current_hotel_id')
        ]);
    }

    public function switch(Request $request, $hotelId)
    {
        $user = $request->user();
        
        if ($user->switchHotel($hotelId)) {
            return redirect()->back()->with('success', 'Hotel alterado com sucesso!');
        }

        return redirect()->back()->with('error', 'Você não tem acesso a este hotel.');
    }

    // Métodos para o painel SaaS
    public function adminIndex(Request $request)
    {
        $this->authorize('viewAny', Hotel::class);

        $hotels = Hotel::with(['users' => function($query) {
            $query->wherePivot('active', true);
        }])->withCount('rooms', 'reservations')->paginate(10);

        return Inertia::render('Admin/Hotels/Index', [
            'hotels' => $hotels
        ]);
    }

    public function create()
    {
        $this->authorize('create', Hotel::class);

        return Inertia::render('Admin/Hotels/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Hotel::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:hotels',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'rooms_count' => 'required|integer|min:1'
        ]);

        $hotel = Hotel::create($validated);

        return redirect()->route('admin.hotels.index')
            ->with('success', 'Hotel criado com sucesso!');
    }

    public function edit(Hotel $hotel)
    {
        $this->authorize('update', $hotel);

        $hotel->load(['users' => function($query) {
            $query->wherePivot('active', true);
        }]);

        return Inertia::render('Admin/Hotels/Edit', [
            'hotel' => $hotel
        ]);
    }

    public function update(Request $request, Hotel $hotel)
    {
        $this->authorize('update', $hotel);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:hotels,email,' . $hotel->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'rooms_count' => 'required|integer|min:1',
            'active' => 'boolean'
        ]);

        $hotel->update($validated);

        return redirect()->route('admin.hotels.index')
            ->with('success', 'Hotel atualizado com sucesso!');
    }

    public function destroy(Hotel $hotel)
    {
        $this->authorize('delete', $hotel);

        $hotel->delete();

        return redirect()->route('admin.hotels.index')
            ->with('success', 'Hotel excluído com sucesso!');
    }

    public function addUser(Request $request, Hotel $hotel)
    {
        $this->authorize('update', $hotel);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:admin,reception,manager'
        ]);

        // Verificar se o usuário já está associado ao hotel
        if ($hotel->users()->where('user_id', $validated['user_id'])->exists()) {
            return redirect()->back()->with('error', 'Usuário já está associado a este hotel.');
        }

        $hotel->users()->attach($validated['user_id'], [
            'role' => $validated['role'],
            'active' => true
        ]);

        return redirect()->back()->with('success', 'Usuário adicionado ao hotel com sucesso!');
    }

    public function removeUser(Request $request, Hotel $hotel, User $user)
    {
        $this->authorize('update', $hotel);

        $hotel->users()->updateExistingPivot($user->id, ['active' => false]);

        return redirect()->back()->with('success', 'Usuário removido do hotel com sucesso!');
    }
}
