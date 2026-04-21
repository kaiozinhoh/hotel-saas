<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SaaSUserController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $users = User::with(['hotels' => function($query) {
            $query->wherePivot('active', true);
        }])->paginate(10);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        $hotels = Hotel::where('active', true)->get();

        return Inertia::render('Admin/Users/Create', [
            'hotels' => $hotels
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,reception,manager,super_admin',
            'hotels' => 'required|array',
            'hotels.*' => 'required|exists:hotels,id',
            'hotel_roles' => 'required|array',
            'hotel_roles.*' => 'required|in:admin,reception,manager'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'active' => true
        ]);

        // Associar usuário aos hotéis selecionados
        foreach ($validated['hotels'] as $index => $hotelId) {
            $user->hotels()->attach($hotelId, [
                'role' => $validated['hotel_roles'][$hotelId] ?? 'reception',
                'active' => true
            ]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuário criado com sucesso!');
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);

        $user->load(['hotels' => function($query) {
            $query->wherePivot('active', true);
        }]);

        $hotels = Hotel::where('active', true)->get();

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'hotels' => $hotels
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,reception,manager,super_admin',
            'active' => 'boolean',
            'hotels' => 'nullable|array',
            'hotels.*' => 'required|exists:hotels,id',
            'hotel_roles' => 'nullable|array',
            'hotel_roles.*' => 'required|in:admin,reception,manager'
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'active' => $validated['active']
        ]);

        // Atualizar associações com hotéis
        if (isset($validated['hotels'])) {
            // Remover todas as associações atuais
            $user->hotels()->newPivotStatement()->where('user_id', $user->id)->update(['active' => false]);

            // Adicionar novas associações
            foreach ($validated['hotels'] as $hotelId) {
                $user->hotels()->syncWithoutDetaching([$hotelId => [
                    'role' => $validated['hotel_roles'][$hotelId] ?? 'reception',
                    'active' => true
                ]]);
            }
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuário atualizado com sucesso!');
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        // Desativar em vez de deletar para manter histórico
        $user->update(['active' => false]);
        $user->hotels()->newPivotStatement()->where('user_id', $user->id)->update(['active' => false]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuário desativado com sucesso!');
    }

    public function toggleStatus(User $user)
    {
        $this->authorize('update', $user);

        $user->update(['active' => !$user->active]);

        return redirect()->back()->with('success', 
            $user->active ? 'Usuário ativado com sucesso!' : 'Usuário desativado com sucesso!'
        );
    }
}
