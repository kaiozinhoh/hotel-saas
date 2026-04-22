# Guia de Instalação com PM2 - Hotel Manager

## Pré-requisitos

- **PHP 8.2+** com extensões: `php-mysql`, `php-zip`, `php-bcmath`, `php-ctype`, `php-fileinfo`, `php-mbstring`, `php-xml`
- **Node.js 18+** e **NPM**
- **Composer**
- **PM2** (será instalado automaticamente)
- **MySQL** (banco de dados)

## Instalação Rápida

### 1. Clonar o projeto
```bash
git clone <repository-url>
cd hotel-manager
```

### 2. Executar setup automático
```bash
chmod +x setup-pm2.sh
./setup-pm2.sh
```

### 3. Configurar variáveis de ambiente
```bash
nano .env
```

Configure pelo menos:
```env
APP_NAME="Hotel Manager"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://exchange.replayzone.com.br

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hotel_manager
DB_USERNAME=root
DB_PASSWORD=sua_senha
```

### 4. Reiniciar PM2 com novas variáveis
```bash
pm2 restart hotel-manager-laravel
pm2 restart hotel-manager-queue
```

## Comandos PM2 Úteis

### Status e Logs
```bash
pm2 status                    # Ver status das aplicações
pm2 logs hotel-manager-laravel  # Ver logs do Laravel
pm2 logs hotel-manager-queue     # Ver logs do Queue
pm2 monit                     # Monitoramento em tempo real
```

### Gerenciamento
```bash
pm2 restart hotel-manager-laravel    # Reiniciar Laravel
pm2 restart hotel-manager-queue       # Reiniciar Queue
pm2 stop hotel-manager-laravel       # Parar Laravel
pm2 stop hotel-manager-queue          # Parar Queue
pm2 delete hotel-manager-laravel     # Remover Laravel
pm2 delete hotel-manager-queue        # Remover Queue
```

### Configuração
```bash
pm2 save                      # Salvar configuração atual
pm2 startup                   # Configurar auto-inicialização
pm2 reload ecosystem.config.js # Recarregar configuração
```


## Estrutura do Projeto

```
hotel-manager/
 ecosystem.config.js     # Configuração PM2
 setup-pm2.sh          # Script de instalação
 PM2_GUIDE.md          # Este guia
```

## Aplicações PM2

### 1. hotel-manager-laravel
- **Script:** `php artisan serve --host=0.0.0.0 --port=3000`
- **Função:** Servidor web Laravel
- **Porta:** 3000
- **Acesso:** Direto via http://localhost:3000

### 2. hotel-manager-queue
- **Script:** `php artisan queue:work`
- **Função:** Processamento de filas
- **Memória:** 512MB max
- **Restart:** Automático

## Troubleshooting

### Erro: PHP não encontrado
```bash
# Verificar instalação PHP
which php
php --version

# Instalar PHP (Ubuntu/Debian)
sudo apt update
sudo apt install php8.2-fpm php8.2-mysql php8.2-zip php8.2-bcmath
```

### Erro: Permissões negadas
```bash
# Ajustar permissões
sudo chown -R $USER:$USER storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Erro: Banco não conecta
```bash
# Verificar configuração
php artisan tinker
>>> DB::connection()->getPdo();
```

### Erro: Porta 3000 em uso
```bash
# Verificar processo na porta
sudo netstat -tlnp | grep :3000

# Matar processo
sudo kill -9 <PID>
```


## Monitoramento

### Logs em tempo real
```bash
pm2 logs --lines 100
```

### Monitoramento web
```bash
pm2 plus  # Requer conta PM2 Plus
```

### Backup automático
```bash
# Adicionar ao crontab
crontab -e

# Backup diário às 2h
0 2 * * * /path/to/backup-script.sh
```

## Performance

### Otimizações PHP
```bash
# Configurar php.ini
memory_limit = 512M
max_execution_time = 300
upload_max_filesize = 64M
post_max_size = 64M
```

### Otimizações PM2
```bash
# Aumentar instâncias se necessário
pm2 scale hotel-manager-laravel 2
```

### Cache Laravel
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
