# Hotel Manager SaaS - Instalação no EasyPanel

## Visão Geral

Este documento descreve como instalar o Sistema de Gestão Hoteleira SaaS no EasyPanel de forma rápida e automatizada.

## Pré-requisitos

- EasyPanel instalado e configurado
- Acesso root ao servidor
- Domínio configurado para apontar para o EasyPanel

## Instalação via Docker

### Método 1: Usando Docker Compose (Recomendado)

1. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd hotel-manager
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
APP_NAME="Hotel Manager SaaS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seu-dominio.com

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=hotel_manager
DB_USERNAME=root
DB_PASSWORD=sua_senha_segura
```

3. **Inicie os containers:**
```bash
docker-compose up -d
```

4. **Execute as migrações e seeders:**
```bash
docker-compose exec app php artisan migrate --seed
php artisan storage:link
```

### Método 2: Instalação Direta no EasyPanel

1. **Crie um novo site no EasyPanel:**
   - Tipo: Laravel
   - Domínio: seu-dominio.com
   - PHP: 8.2+

2. **Configure as variáveis de ambiente no EasyPanel:**
   - Vá para "Settings" > "Environment Variables"
   - Adicione as variáveis necessárias do arquivo `.env.example`

3. **Instale as dependências:**
   ```bash
   cd /var/www/html
   composer install --optimize-autoloader --no-dev
   npm install
   npm run build
   ```

4. **Configure o banco de dados:**
   - Crie um banco de dados MySQL no EasyPanel
   - Execute as migrações:
   ```bash
   php artisan migrate --seed
   ```

5. **Configure permissões:**
   ```bash
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

6. **Crie o link simbólico:**
   ```bash
   php artisan storage:link
   ```

## Configuração Pós-Instalação

### Acesso Inicial

Após a instalação, você pode acessar o sistema com:

**Super Administrador SaaS:**
- E-mail: `superadmin@saas.com`
- Senha: `password`

**Administrador de Hotel:**
- E-mail: `admin@hotel.com`
- Senha: `password`

**Recepcionista:**
- E-mail: `reception@hotel.com`
- Senha: `password`

### Passos Importantes

1. **Altere as senhas padrão** imediatamente após o primeiro acesso
2. **Configure o domínio** corretamente nas configurações
3. **Verifique as permissões** das pastas storage e bootstrap/cache
4. **Configure o SSL** no EasyPanel para HTTPS

## Estrutura do Sistema

### Multi-Hotel
- Cada usuário pode ter acesso a múltiplos hotéis
- Seletor de hotéis no dashboard
- Dados isolados por hotel

### Papéis de Usuário
- **Super Admin**: Gerencia todo o sistema SaaS
- **Admin**: Gerencia um hotel específico
- **Manager**: Gerencia operações do hotel
- **Reception**: Acesso operacional básico

### Painel SaaS
Acesse `/admin` para gerenciar:
- Hotéis
- Usuários
- Configurações globais

## Troubleshooting

### Problemas Comuns

1. **Erro 500 - Permissões:**
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

2. **Banco de dados não conecta:**
- Verifique as credenciais no `.env`
- Confirme se o banco de dados existe
- Teste a conexão com `php artisan tinker`

3. **Assets não carregam:**
```bash
npm run build
php artisan optimize:clear
```

4. **Erro de chave de aplicação:**
```bash
php artisan key:generate
```

### Logs de Erro

Verifique os logs em:
- Laravel: `storage/logs/laravel.log`
- Apache/Nginx: Logs do servidor web
- Docker: `docker-compose logs app`

## Backup e Manutenção

### Backup Automático
Configure backups automáticos no EasyPanel para:
- Banco de dados
- Arquivos de storage
- Configurações

### Atualizações
1. Faça backup antes de atualizar
2. Pull das atualizações
3. Execute `composer install` e `npm run build`
4. Execute migrações se houver

## Suporte

Para dúvidas e suporte:
- WhatsApp: https://cubovirtual.com.br
- Documentação completa no repositório

## Considerações de Segurança

1. **Manter o sistema atualizado**
2. **Usar senhas fortes**
3. **Configurar HTTPS**
4. **Limitar acessos por IP se possível**
5. **Monitorar logs de acesso**

## Performance

Para melhor performance:
- Use Redis para cache e sessões
- Configure OPcache
- Use CDN para assets estáticos
- Otimize o banco de dados regularmente
