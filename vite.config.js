import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
            buildAssets: {
                // Usar caminhos relativos em vez de URL absoluta
                assetUrlPrefix: '',
            },
        }),
        react(),
    ],
    build: {
        // Garantir que os assets usem caminhos relativos
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                // Usar caminhos relativos para todos os assets
                assetFileNames: 'assets/[name].[hash][extname]',
                chunkFileNames: 'assets/[name].[hash].js',
                entryFileNames: 'assets/[name].[hash].js',
            },
        },
    },
    // Configurar base URL para ser relativo
    base: './',
});
