module.exports = {
  apps: [
    {
      name: 'hotel-manager-laravel',
      script: 'php',
      args: 'artisan serve --host=0.0.0.0 --port=3000',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        APP_ENV: 'production',
        APP_DEBUG: false,
        APP_URL: 'https://exchange.replayzone.com.br',
      },
      env_production: {
        NODE_ENV: 'production',
        APP_ENV: 'production',
        APP_DEBUG: false,
        APP_URL: 'https://exchange.replayzone.com.br',
      }
    },
    {
      name: 'hotel-manager-queue',
      script: 'php',
      args: 'artisan queue:work --sleep=3 --tries=3 --max-time=3600',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        APP_ENV: 'production',
      }
    }
  ]
};
