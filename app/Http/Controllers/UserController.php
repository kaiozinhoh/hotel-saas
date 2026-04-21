<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    // Listar usuários
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Acesso não autorizado.');
        }

        $users = User::where('id', '!=', $request->user()->id) // Não listar a si mesmo (visual)
            ->orderBy('name')
            ->get();

        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    // Criar novo usuário
    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') abort(403);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,receptionist'
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
            'active' => true // Garante que nasce ativo
        ]);

        return back()->with('success', 'Usuário criado com sucesso!');
    }

    // Remover usuário
    public function destroy(Request $request, User $user)
    {
        if ($request->user()->role !== 'admin') abort(403);

        // TRAVA DE SEGURANÇA: Impedir auto-exclusão (back-end)
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Você não pode excluir sua própria conta.');
        }

        $user->delete();

        return back()->with('success', 'Usuário removido.');
    }
}
