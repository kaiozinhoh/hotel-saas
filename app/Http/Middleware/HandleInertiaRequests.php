<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = Setting::first(); // (Código que adicionamos na etapa do logo)

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            // --- ESTA PARTE É ESSENCIAL PARA OS TOASTS ---
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
            ],
            // ---------------------------------------------
            'app_settings' => [
                'hotel_name' => $settings->hotel_name ?? 'Laravel Hotel',
                'logo_url' => $settings && $settings->logo_path
                    ? asset('storage/' . $settings->logo_path)
                    : null,
            ],
        ];
    }
}
