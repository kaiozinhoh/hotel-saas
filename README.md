# Hotel Manager SaaS

Sistema completo de gestão hoteleira multi-tenancy com arquitetura SaaS, desenvolvido em Laravel 11 + React + Inertia.js.

## 🚀 Funcionalidades Principais

### Multi-Hotel (SaaS)
- ✅ **Gestão de Múltiplos Hotéis**: Um único usuário pode gerenciar vários hotéis
- ✅ **Seletor de Hotéis**: Interface intuitiva para alternar entre hotéis
- ✅ **Dados Isolados**: Cada hotel com seus dados completamente separados
- ✅ **Painel Administrativo SaaS**: Gerencie todos os hotéis e usuários do sistema

### Gestão Hoteleira
- 🏨 **Reservas**: Sistema completo de reservas com status
- 🛏️ **Quartos**: Gestão de quartos e disponibilidade
- 👥 **Hóspedes**: Cadastro e gerenciamento de hóspedes
- 📅 **Calendário**: Visualização completa das reservas
- 🧾 **Financeiro**: Controle de pagamentos e despesas
- 🛒 **Produtos**: Gestão de produtos para consumo nos quartos
- 🚗 **Estacionamento**: Controle de vagas de estacionamento

### Sistema de Usuários
- 👤 **Múltiplos Papéis**: Super Admin, Admin, Gerente, Recepção
- 🔐 **Controle de Acesso**: Permissões granulares por função
- 🏢 **Acesso por Hotel**: Cada usuário pode ter acesso específico a hotéis

## 🏗️ Arquitetura

### Backend
- **Framework**: Laravel 11
- **Banco**: MySQL 8.0 / MariaDB 10.3+
- **Autenticação**: Laravel Sanctum
- **Cache**: Database/Redis

### Frontend
- **Framework**: React 18
- **Navegação**: Inertia.js
- **UI**: Tailwind CSS + Shadcn/ui
- **Ícones**: Lucide React

### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **Web Server**: Apache/Nginx
- **Deploy**: EasyPanel compatível

## 📦 Instalação

### Pré-requisitos
- PHP 8.2+
- Node.js 18+
- MySQL 8.0+ / MariaDB 10.3+
- Composer
- Docker (opcional)

### Instalação Rápida (Docker)

1. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd hotel-manager
```

2. **Configure o ambiente:**
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

3. **Inicie os containers:**
```bash
docker-compose up -d
```

4. **Instale o sistema:**
```bash
docker-compose exec app php artisan migrate --seed
docker-compose exec app php artisan storage:link
```

### Instalação Manual

Siga o [guia de instalação completa](EASYPANEL_INSTALL.md) para EasyPanel ou instalação manual.

## 🔐 Acesso Padrão

Após a instalação, use estas credenciais:

### Super Administrador SaaS
- **E-mail**: `superadmin@saas.com`
- **Senha**: `password`
- **Acesso**: `/admin` - Painel SaaS completo

### Administrador de Hotel
- **E-mail**: `admin@hotel.com`
- **Senha**: `password`
- **Acesso**: Dashboard operacional

### Recepcionista
- **E-mail**: `reception@hotel.com`
- **Senha**: `password`
- **Acesso**: Operações básicas

> **⚠️ Importante**: Altere as senhas padrão após o primeiro acesso!

## 📱 Telas do Sistema

### Dashboard Principal
- 📊 **Estatísticas em Tempo Real**: Ocupação, faturamento, check-ins
- 🏨 **Seletor de Hotéis**: Alterne facilmente entre hotéis
- 📈 **Relatórios Rápidos**: Produtos mais vendidos, últimas reservas

### Gestão de Hotéis (SaaS)
- 🏢 **Cadastro de Hotéis**: Complete com endereço e configurações
- 👥 **Gestão de Usuários**: Associe usuários aos hotéis
- 📊 **Relatórios Globais**: Visão de todos os hotéis

### Operações do Hotel
- 🛏️ **Gestão de Quartos**: Status, preços, manutenção
- 📅 **Calendário de Reservas**: Visualização mensal/semanal
- 👥 **Cadastro de Hóspedes**: Histórico completo
- 🧾 **Check-in/Check-out**: Processo automatizado
- 💰 **Financeiro**: Pagamentos, despesas, relatórios

## 🔧 Configurações

### Variáveis de Ambiente Principais
```env
APP_NAME="Hotel Manager SaaS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seu-dominio.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hotel_manager
DB_USERNAME=usuario
DB_PASSWORD=senha
```

### Permissões Necessárias
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## 🚀 Deploy

### EasyPanel
O sistema é 100% compatível com EasyPanel. Veja o [guia completo](EASYPANEL_INSTALL.md).

### Docker
```bash
docker-compose up -d
```

### Servidor Tradicional
Siga os requisitos no arquivo de instalação original.

## 📊 Estrutura do Banco

### Tabelas Principais
- `hotels` - Cadastro de hotéis
- `user_hotel` - Relacionamento usuário x hotel
- `rooms` - Quartos (com hotel_id)
- `reservations` - Reservas (com hotel_id)
- `guests` - Hóspedes (com hotel_id)
- `products` - Produtos (com hotel_id)
- `payments` - Pagamentos (com hotel_id)

## 🔄 Fluxo de Trabalho

### 1. Configuração Inicial
1. Acesse como Super Admin
2. Cadastre os hotéis no painel SaaS
3. Crie usuários e associe aos hotéis
4. Configure quartos e produtos

### 2. Operação Diária
1. Usuários fazem login
2. Selecionam o hotel desejado
3. Realizam operações do hotel
4. Dados ficam isolados por hotel

### 3. Gestão SaaS
1. Super Admin gerencia todos os hotéis
2. Monitora usuários e acessos
3. Configurações globais do sistema

## 🛠️ Tecnologias Utilizadas

### Backend
- **Laravel 11**: Framework PHP principal
- **MySQL**: Banco de dados relacional
- **Sanctum**: Autenticação API
- **Eloquent**: ORM para manipulação de dados

### Frontend
- **React 18**: Biblioteca JavaScript
- **Inertia.js**: Conexão frontend/backend
- **Tailwind CSS**: Framework CSS
- **Shadcn/ui**: Componentes UI
- **Lucide**: Ícones modernos

### DevOps
- **Docker**: Containerização
- **Docker Compose**: Orquestração
- **Apache/Nginx**: Web server
- **EasyPanel**: Painel de gerenciamento

## 📝 Desenvolvimento

### Comandos Úteis
```bash
# Instalar dependências
composer install
npm install

# Compilar assets
npm run build
npm run dev

# Migrations
php artisan migrate
php artisan db:seed

# Limpar cache
php artisan optimize:clear
```

### Estrutura de Arquivos
```
├── app/
│   ├── Http/Controllers/    # Controllers
│   ├── Models/             # Models Eloquent
│   └── Http/Middleware/    # Middlewares
├── database/
│   ├── migrations/         # Migrações do BD
│   └── seeders/           # Dados iniciais
├── resources/js/
│   ├── Pages/             # Páginas React
│   └── Components/        # Componentes UI
└── routes/
    └── web.php           # Rotas da aplicação
```

## 🔒 Segurança

- ✅ **Isolamento de Dados**: Cada hotel com dados separados
- ✅ **Controle de Acesso**: Papéis e permissões granulares
- ✅ **Validação de Input**: Sanitização automática
- ✅ **Proteção CSRF**: Token em formulários
- ✅ **Hash de Senhas**: Bcrypt seguro

## 📈 Performance

- ⚡ **Cache Configurável**: Database/Redis
- 🚀 **Assets Otimizados**: Compilação production
- 📦 **Lazy Loading**: Carregamento sob demanda
- 🗄️ **Índices BD**: Consultas otimizadas

## 🤝 Suporte

Para suporte e dúvidas:
- **WhatsApp**: [Cubo Virtual](https://cubovirtual.com.br)
- **Documentação**: [Guia de Instalação](EASYPANEL_INSTALL.md)
- **Issues**: GitHub do projeto

## 📄 Licença

Este projeto é software proprietário. Todos os direitos reservados à Cubo Virtual.

---

**Desenvolvido com ❤️ por [Cubo Virtual](https://cubovirtual.com.br)**
