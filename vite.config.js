import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        // Configuração para produção com HTTPS
        assetsDir: 'assets',
        outDir: 'public/build',
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name].[hash][extname]',
                chunkFileNames: 'assets/[name].[hash].js',
                entryFileNames: 'assets/[name].[hash].js',
            },
        },
        // Garantir URLs relativas (sem protocolo)
        assetsInlineLimit: 0,
    },
    // Usar URLs relativas para evitar mixed content
    base: './',
    server: {
        https: false,
        host: true,
    },
});
