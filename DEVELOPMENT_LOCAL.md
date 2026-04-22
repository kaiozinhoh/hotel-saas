# GUIA DE DESENVOLVIMENTO LOCAL

## AMBIENTE LOCAL COM DOCKER

### **Pré-requisitos:**
- Docker Desktop instalado
- Git instalado
- VS Code (opcional)

---

## **1. Clonar o Repositório**

```bash
git clone https://github.com/kaiozinho/hotel-saas.git
cd hotel-saas
```

---

## **2. Configurar Ambiente Local**

### **Opção A: Docker Compose (Recomendado)**

```bash
# Iniciar todos os serviços
docker-compose up -d

# Acessar aplicação
# http://localhost:8000

# Acessar phpMyAdmin
# http://localhost:8080
# Usuario: root
# Senha: secret
```

### **Opção B: Docker Manual**

```bash
# Construir imagem
docker build -t hotel-manager .

# Rodar container
docker run -d \
  --name hotel-manager-local \
  -p 8000:80 \
  -e APP_NAME="Hotel Manager Local" \
  -e APP_ENV=local \
  -e APP_DEBUG=true \
  -e APP_URL=http://localhost:8000 \
  -e APP_KEY=base64:hqUlRmDKFXK8nJDvwF/iGS44ZXXdpQMLuRN+UqJOuWo= \
  -e DB_CONNECTION=sqlite \
  hotel-manager
```

---

## **3. Configurar Banco de Dados**

### **Com Docker Compose (MySQL):**
```bash
# O banco é criado automaticamente
# Acessar via phpMyAdmin: http://localhost:8080
```

### **Com SQLite (Mais Simples):**
```bash
# Criar banco SQLite
touch database/database.sqlite

# Configurar .env.local
cp .env.example .env.local
```

Editar `.env.local`:
```bash
APP_NAME="Hotel Manager Local"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_KEY=base64:hqUlRmDKFXK8nJDvwF/iGS44ZXXdpQMLuRN+UqJOuWo=

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
```

---

## **4. Instalar e Configurar**

```bash
# Acessar o container
docker exec -it hotel-manager-app bash

# Instalar dependências
composer install
npm install

# Rodar migrations
php artisan migrate --force

# Rodar seeds
php artisan db:seed --force

# Criar storage link
php artisan storage:link

# Compilar assets
npm run build

# Limpar cache
php artisan config:clear
php artisan cache:clear
```

---

## **5. Testar Subdomínios Localmente**

### **Editar hosts do Windows:**
```bash
# Abrir como Administrador: C:\Windows\System32\drivers\etc\hosts

# Adicionar linhas:
127.0.0.1   localhost
127.0.0.1   www.localhost
127.0.0.1   maerainha.localhost
127.0.0.1   hotelabc.localhost
```

### **Testar URLs:**
- **Painel Admin:** http://www.localhost:8000
- **Hotel Mãe Rainha:** http://maerainha.localhost:8000
- **Hotel ABC:** http://hotelabc.localhost:8000

---

## **6. Criar Hotel de Teste**

```bash
# Acessar tinker no container
docker exec -it hotel-manager-app php artisan tinker

# Criar hotel
$hotel = new \App\Models\Hotel();
$hotel->name = 'Hotel Mãe Rainha';
$hotel->subdomain = 'maerainha';
$hotel->port = 8081;
$hotel->email = 'contato@maerainha.com';
$hotel->active = true;
$hotel->save();

# Criar outro hotel
$hotel2 = new \App\Models\Hotel();
$hotel2->name = 'Hotel ABC';
$hotel2->subdomain = 'hotelabc';
$hotel2->port = 8082;
$hotel2->email = 'contato@hotelabc.com';
$hotel2->active = true;
$hotel2->save();
```

---

## **7. Comandos Úteis**

```bash
# Ver logs do container
docker logs hotel-manager-app -f

# Acessar container
docker exec -it hotel-manager-app bash

# Reiniciar serviços
docker-compose restart

# Parar tudo
docker-compose down

# Limpar volumes (cuidado!)
docker-compose down -v
```

---

## **8. Debug e Desenvolvimento**

### **Ativar Debug:**
No `.env.local`:
```bash
APP_DEBUG=true
LOG_CHANNEL=stack
LOG_LEVEL=debug
```

### **Ver Logs:**
```bash
# Logs Laravel
docker exec -it hotel-manager-app tail -f storage/logs/laravel.log

# Logs Apache
docker exec -it hotel-manager-app tail -f /var/log/apache2/error.log
```

### **Recarregar Assets:**
```bash
# Dentro do container
npm run dev
# ou
npm run watch
```

---

## **9. Testes Automáticos**

```bash
# Rodar testes
docker exec -it hotel-manager-app php artisan test

# Rodar testes específicos
docker exec -it hotel-manager-app php artisan test tests/Feature/HotelTest.php
```

---

## **10. Deploy para EasyPanel**

### **1. Fazer Push das Alterações:**
```bash
git add .
git commit -m "Configuração local e testes"
git push origin main
```

### **2. Atualizar EasyPanel:**
- Fazer novo deploy no EasyPanel
- Configurar variáveis de ambiente
- Testar subdomínios

---

## **Credenciais Padrão (Local):**

### **Super Admin:**
- Email: `superadmin@saas.com`
- Senha: `password`

### **Admin Hotel:**
- Email: `admin@hotel.com`
- Senha: `password`

---

## **Troubleshooting Local:**

### **Erro 500:**
```bash
# Verificar permissões
docker exec -it hotel-manager-app chmod -R 777 storage bootstrap/cache

# Verificar .env
docker exec -it hotel-manager-app cat .env

# Limpar cache
docker exec -it hotel-manager-app php artisan optimize:clear
```

### **Subdomínios não funcionam:**
- Verificar arquivo `hosts` do Windows
- Limpar cache do navegador
- Verificar se hotel existe no banco

### **Assets não carregam:**
```bash
# Recompilar
docker exec -it hotel-manager-app npm run build

# Limpar cache
docker exec -it hotel-manager-app php artisan view:clear
```

---

**Este ambiente local permite testar tudo antes de fazer deploy!**
