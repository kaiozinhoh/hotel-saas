# GUIA SIMPLES - INSTALAÇÃO NO EASYPANEL

## RESUMO RÁPIDO (SEM COMPLICAÇÕES)

### 1. CONFIGURAÇÃO DO DOCKERFILE
O Dockerfile está **100% otimizado** para EasyPanel:
- Extensões PHP: `pdo_mysql`, `pdo_sqlite`, `zip`, `bcmath`, `ctype`, `fileinfo`, `mbstring`, `xml`, `gd`
- Apache configurado para Laravel
- Permissões corretas
- Build de assets automático

### 2. VARIÁVEIS DE AMBIENTE (JÁ CONFIGURADAS)
No EasyPanel, adicione estas variáveis:

```bash
APP_NAME=Exchange Hotel
APP_ENV=production
APP_DEBUG=false
APP_URL=https://www.exchangesistemas.com.br/demo-hotel
ASSET_URL=https://www.exchangesistemas.com.br/demo-hotel/public

APP_KEY=base64:SEU_APP_KEY_AQUI
DB_CONNECTION=mysql
DB_HOST=172.17.0.1:5174
DB_PORT=3305
DB_DATABASE=exchange-hotel
DB_USERNAME=root
DB_PASSWORD=Kaio@3005

# Outras variáveis padrão...
```

### 3. PASSO A PASSO - EASYPANEL

#### PASSO 1: Criar Aplicação
1. No EasyPanel: **Applications** > **+ New Application**
2. Selecione: **Custom Dockerfile**
3. GitHub Repository: `kaiozinho/hotel-saas`
4. Dockerfile Path: `Dockerfile`
5. Domain: `www.exchangesistemas.com.br`

#### PASSO 2: Configurar Variáveis
1. Vá em **Environment Variables**
2. Adicione **TODAS** as variáveis (incluindo APP_KEY)
3. Salve

#### PASSO 3: Deploy
1. Clique em **Deploy**
2. Aguarde o build (deve funcionar 100%)
3. Se der erro, verifique as variáveis de ambiente

#### PASSO 4: Configurar Banco (APENAS 1 VEZ)
Após o deploy funcionar, execute via SSH no container:
```bash
# Acessar o container
docker exec -it NOME_DO_CONTAINER bash

# Rodar migrate e seed
php artisan migrate --force
php artisan db:seed --force
```

### 4. ACESSO INICIAL
- URL: `https://www.exchangesistemas.com.br/demo-hotel`
- E-mail: `admin@hotel.com`
- Senha: `password`

## SOLUÇÃO DE PROBLEMAS

### ERRO 500?
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme se o banco MySQL está acessível

### ERRO DE BUILD?
- Verifique se o Dockerfile está correto
- Confirme se o repositório GitHub está atualizado

### BANCO NÃO CONECTA?
- Teste a conexão MySQL com as credenciais
- Verifique se o IP:PORTA do EasyPanel está correto

## DICAS IMPORTANTES

1. **NÃO** execute `key:generate` no Dockerfile
2. **NÃO** execute `migrate` no Dockerfile
3. **SIM** configure todas as variáveis de ambiente
4. **SIM** execute migrate apenas após o deploy

## CONTATO
Se ainda tiver problemas, verifique:
- Logs do container no EasyPanel
- Configuração do banco de dados
- Variáveis de ambiente

---

**Este guia é para instalação rápida e sem complicações no EasyPanel!**
