# GUIA WINDOWS - DESENVOLVIMENTO LOCAL SEM COMPOSE

## **MÉTODO 1: Script Automático (Recomendado)**

### **Passo 1: Baixar o Projeto**
```bash
git clone https://github.com/kaiozinho/hotel-saas.git
cd hotel-saas
```

### **Passo 2: Executar Script**
```bash
# Duplo clique no arquivo:
setup-local.bat

# Ou executar no terminal:
setup-local.bat
```

### **Passo 3: Configurar Hosts**
Abra como **Administrador** o arquivo:
```
C:\Windows\System32\drivers\etc\hosts
```

Adicione estas linhas:
```
127.0.0.1   localhost
127.0.0.1   www.localhost
127.0.0.1   maerainha.localhost
127.0.0.1   hotelabc.localhost
```

### **Passo 4: Acessar**
- **Aplicação:** http://localhost:8000
- **Painel Admin:** http://www.localhost:8000
- **Hotel Mãe Rainha:** http://maerainha.localhost:8000

---

## **MÉTODO 2: Manual Passo a Passo**

### **Pré-requisitos:**
- Docker Desktop instalado
- Git instalado

### **1. Clonar o Projeto**
```bash
git clone https://github.com/kaiozinho/hotel-saas.git
cd hotel-saas
```

### **2. Construir Imagem Docker**
```bash
docker build -t hotel-manager-local .
```

### **3. Criar Banco SQLite**
```bash
# Criar pasta database se não existir
mkdir database

# Criar arquivo do banco
type nul > database\database.sqlite
```

### **4. Criar .env.local**
Crie o arquivo `.env.local` com este conteúdo:
```bash
APP_NAME="Hotel Manager Local"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_KEY=base64:hqUlRmDKFXK8nJDvwF/iGS44ZXXdpQMLuRN+UqJOuWo=

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

### **5. Iniciar Container**
```bash
docker run -d --name hotel-manager-local -p 8000:80 ^
    -v "%cd%":/var/www/html ^
    -v "%cd%\storage":/var/www/html/storage ^
    -v "%cd%\bootstrap\cache":/var/www/html/bootstrap/cache ^
    hotel-manager-local
```

### **6. Configurar Aplicação**
```bash
# Rodar migrations
docker exec hotel-manager-local php artisan migrate --force

# Rodar seeds
docker exec hotel-manager-local php artisan db:seed --force

# Criar storage link
docker exec hotel-manager-local php artisan storage:link

# Limpar cache
docker exec hotel-manager-local php artisan config:clear
docker exec hotel-manager-local php artisan cache:clear
```

### **7. Compilar Assets**
```bash
docker exec hotel-manager-local npm run build
```

### **8. Configurar Hosts**
Editar como **Administrador** o arquivo:
```
C:\Windows\System32\drivers\etc\hosts
```

Adicionar:
```
127.0.0.1   localhost
127.0.0.1   www.localhost
127.0.0.1   maerainha.localhost
127.0.0.1   hotelabc.localhost
```

---

## **MÉTODO 3: Apenas Docker (Sem Volume)**

### **Para teste rápido:**
```bash
# Construir e rodar
docker build -t hotel-manager-test .
docker run -d --name hotel-manager-test -p 8000:80 hotel-manager-test

# Configurar (se necessário)
docker exec hotel-manager-test php artisan migrate --force
```

---

## **COMANDOS ÚTEIS**

### **Verificar Status:**
```bash
# Ver logs
docker logs hotel-manager-local -f

# Ver container rodando
docker ps

# Acessar container
docker exec -it hotel-manager-local bash
```

### **Gerenciar Container:**
```bash
# Parar
docker stop hotel-manager-local

# Reiniciar
docker restart hotel-manager-local

# Remover
docker rm hotel-manager-local

# Remover imagem
docker rmi hotel-manager-local
```

### **Debug:**
```bash
# Ver logs Laravel
docker exec hotel-manager-local tail -f storage/logs/laravel.log

# Limpar cache
docker exec hotel-manager-local php artisan optimize:clear

# Verificar .env
docker exec hotel-manager-local cat .env
```

---

## **TESTAR SUBDOMÍNIOS**

### **Criar Hotel de Teste:**
```bash
# Acessar tinker
docker exec -it hotel-manager-local php artisan tinker

# Criar hotel
$hotel = new \App\Models\Hotel();
$hotel->name = 'Hotel Mãe Rainha';
$hotel->subdomain = 'maerainha';
$hotel->port = 8081;
$hotel->email = 'contato@maerainha.com';
$hotel->active = true;
$hotel->save();
```

### **Testar URLs:**
- **Painel Admin:** http://www.localhost:8000
- **Hotel Mãe Rainha:** http://maerainha.localhost:8000
- **Hotel ABC:** http://hotelabc.localhost:8000

---

## **PROBLEMAS COMUNS**

### **Porta 8000 em uso:**
```bash
# Usar outra porta
docker run -d --name hotel-manager-local -p 8080:80 hotel-manager-local
```

### **Permissões negadas:**
```bash
# Executar como Administrador
# Ou usar PowerShell como Administrador
```

### **Docker não inicia:**
- Verifique se Docker Desktop está rodando
- Reinicie Docker Desktop
- Verifique se WSL2 está instalado

### **Erro 500:**
```bash
# Verificar permissões
docker exec hotel-manager-local chmod -R 777 storage bootstrap/cache

# Verificar .env
docker exec hotel-manager-local cat .env

# Limpar cache
docker exec hotel-manager-local php artisan optimize:clear
```

---

## **CREDENCIAIS**

### **Super Admin:**
- Email: `superadmin@saas.com`
- Senha: `password`

### **Admin Hotel:**
- Email: `admin@hotel.com`
- Senha: `password`

---

## **DEPLOY PARA EASYPANEL**

### **Após testar localmente:**
```bash
# Fazer commit das mudanças
git add .
git commit -m "Testes locais concluídos"
git push origin main

# Fazer deploy no EasyPanel
```

---

**Este método funciona 100% no Windows sem Docker Compose!**
