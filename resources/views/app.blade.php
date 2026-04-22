<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Hotel Manager') }}</title>

        <link rel="icon" href="/favicon.ico">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />

        @routes
        @viteReactRefresh
        <!-- Assets com URLs relativas para evitar mixed content -->
        <link rel="stylesheet" href="./build/assets/app.css">
        <script src="./build/assets/app.js"></script>
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-gray-50 text-gray-900">
        @inertia
    </body>
</html>
