<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ConsumptionController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\FinancialController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\SaaSUserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rota inicial
Route::get('/', function () {
    return redirect()->route('login');
});

// Rotas Autenticadas (Qualquer usuário logado)
Route::middleware(['auth', 'hotel.selected'])->group(function () {

    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Hotéis - Seleção e troca
    Route::get('/hotels', [HotelController::class, 'index'])->name('hotels.index');
    Route::post('/hotels/{hotel}/switch', [HotelController::class, 'switch'])->name('hotels.switch');

    // Operacional (Todos acessam)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('guests', GuestController::class);
    Route::resource('rooms', RoomController::class);
    Route::resource('reservations', ReservationController::class);
    Route::post('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])->name('reservations.cancel');

    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');
    Route::resource('products', ProductController::class);

    // Ações Específicas
    Route::post('/products/{product}/stock', [ProductController::class, 'addStock'])->name('products.addStock');
    Route::post('/reservations/{reservation}/consumption', [ConsumptionController::class, 'store'])->name('consumption.store');
    Route::delete('/consumption/{id}', [ConsumptionController::class, 'destroy'])->name('consumption.destroy');
    Route::post('/reservations/{reservation}/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // PDF (Qualquer um pode gerar recibo se tiver acesso à reserva)
    Route::get('/receipt/{id}', [ReceiptController::class, 'show'])->name('receipt.show');

    // --- ÁREA RESTRITA (APENAS ADMIN) ---
    // Crie um Middleware simples ou use validação dentro do controller como já fizemos.
    // Mas agrupar ajuda a organizar.
    Route::middleware('admin')->group(function () {

        // Rotas que só Admin toca
        Route::get('/financial', [FinancialController::class, 'index'])->name('financial.index');
        Route::get('/settings', [SettingController::class, 'edit'])->name('settings.edit');
        Route::patch('/settings', [SettingController::class, 'update'])->name('settings.update');
        Route::resource('users', UserController::class);

    });

    // --- ÁREA SaaS (SUPER ADMIN) ---
    Route::middleware(['super.admin'])->group(function () {
        Route::prefix('admin')->name('admin.')->group(function () {
            // Hotéis
            Route::get('/hotels', [HotelController::class, 'adminIndex'])->name('hotels.index');
            Route::get('/hotels/create', [HotelController::class, 'create'])->name('hotels.create');
            Route::post('/hotels', [HotelController::class, 'store'])->name('hotels.store');
            Route::get('/hotels/{hotel}/edit', [HotelController::class, 'edit'])->name('hotels.edit');
            Route::put('/hotels/{hotel}', [HotelController::class, 'update'])->name('hotels.update');
            Route::delete('/hotels/{hotel}', [HotelController::class, 'destroy'])->name('hotels.destroy');
            Route::post('/hotels/{hotel}/add-user', [HotelController::class, 'addUser'])->name('hotels.addUser');
            Route::delete('/hotels/{hotel}/users/{user}', [HotelController::class, 'removeUser'])->name('hotels.removeUser');

            // Usuários SaaS
            Route::get('/users', [SaaSUserController::class, 'index'])->name('users.index');
            Route::get('/users/create', [SaaSUserController::class, 'create'])->name('users.create');
            Route::post('/users', [SaaSUserController::class, 'store'])->name('users.store');
            Route::get('/users/{user}/edit', [SaaSUserController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [SaaSUserController::class, 'update'])->name('users.update');
            Route::delete('/users/{user}', [SaaSUserController::class, 'destroy'])->name('users.destroy');
            Route::post('/users/{user}/toggle', [SaaSUserController::class, 'toggleStatus'])->name('users.toggle');
        });
    });
});

require __DIR__.'/auth.php';
