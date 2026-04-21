<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Validator::extend('cpf', function ($attribute, $value, $parameters, $validator) {
            $c = preg_replace('/\D/', '', $value);
            if (strlen($c) != 11 || preg_match("/^{$c[0]}{11}$/", $c)) return false;

            for ($s = 10, $n = 0, $i = 0; $s >= 2; $n += $c[$i++] * $s--);
            if ($c[9] != ((($n %= 11) < 2) ? 0 : 11 - $n)) return false;

            for ($s = 11, $n = 0, $i = 0; $s >= 2; $n += $c[$i++] * $s--);
            if ($c[10] != ((($n %= 11) < 2) ? 0 : 11 - $n)) return false;

            return true;
        });
        Vite::prefetch(concurrency: 3);
    }
}
