# GUIA - CONFIGURAÇÃO DE SUBDOMÍNIOS NO EASYPANEL

## VISÃO GERAL

Sistema multi-tenant onde cada hotel tem seu próprio subdomínio:

- **www.exchangesistemas.com.br** - Painel Admin (gerenciar hotéis)
- **maerainha.exchangesistemas.com.br** - Hotel Mãe Rainha
- **hotelabc.exchangesistemas.com.br** - Hotel ABC
- **Cada hotel:** Porta única + Proxy EasyPanel

## ESTRUTURA DO SISTEMA

### 1. Banco de Dados
- Tabela `hotels` com campos `subdomain` e `port`
- Cada hotel tem subdomínio único e porta única
- Compartilhamento do mesmo banco MySQL

### 2. Middleware de Subdomínio
- Detecta automaticamente o hotel pelo subdomínio
- Redireciona para painel admin se for `www`
- Define contexto da sessão (admin vs hotel)

### 3. Rotas Multi-tenant
- Rotas diferentes para admin vs hotéis
- Landing page para cada hotel
- Sistema isolado por contexto

## CONFIGURAÇÃO NO EASYPANEL

### Passo 1: Criar Aplicação Principal
```bash
1. Applications > + New Application
2. Custom Dockerfile
3. Repository: kaiozinho/hotel-saas
4. Domain: www.exchangesistemas.com.br
5. Port: 8080 (porta principal)
```

### Passo 2: Configurar Variáveis de Ambiente
```bash
APP_NAME="Hotel Manager SaaS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://www.exchangesistemas.com.br
APP_KEY=base64:hqUlRmDKFXK8nJDvwF/iGS44ZXXdpQMLuRN+UqJOuWo=

DB_CONNECTION=mysql
DB_HOST=172.17.0.1:5174
DB_PORT=3305
DB_DATABASE=exchange-hotel
DB_USERNAME=root
DB_PASSWORD=Kaio@3005
```

### Passo 3: Criar Proxy para Subdomínios

Para cada hotel, crie um proxy no EasyPanel:

#### Exemplo: Hotel Mãe Rainha
```bash
1. Applications > + New Application
2. Proxy
3. Source: maerainha.exchangesistemas.com.br
4. Target: http://localhost:8081
5. Port: 8081
```

#### Exemplo: Hotel ABC
```bash
1. Applications > + New Application
2. Proxy
3. Source: hotelabc.exchangesistemas.com.br
4. Target: http://localhost:8082
5. Port: 8082
```

### Passo 4: Configurar DNS

Configure os registros DNS no seu domínio:

```bash
# Registro A principal
www.exchangesistemas.com.br -> IP_DO_SERVIDOR

# Subdomínios (WildCard ou individuais)
*.exchangesistemas.com.br -> IP_DO_SERVIDOR
ou
maerainha.exchangesistemas.com.br -> IP_DO_SERVIDOR
hotelabc.exchangesistemas.com.br -> IP_DO_SERVIDOR
```

## GERENCIAMENTO DE HOTÉIS

### Criar Novo Hotel

1. Acesse: `https://www.exchangesistemas.com.br/admin`
2. Login como Super Admin
3. Vá para: `Admin > Hotéis > Criar Novo`
4. Preencha os dados:
   ```bash
   Nome: Hotel Mãe Rainha
   Subdomínio: maerainha
   Porta: 8081
   Email: contato@maerainha.com.br
   ```
5. Salve

### Configurar Proxy para o Hotel

1. No EasyPanel: `Applications > + New Application`
2. Tipo: `Proxy`
3. Source: `maerainha.exchangesistemas.com.br`
4. Target: `http://localhost:8081`
5. Port: `8081`

### Acessar o Hotel

- **URL:** `https://maerainha.exchangesistemas.com.br`
- **Login:** Usuários cadastrados para aquele hotel
- **Funcionalidades:** Gestão completa do hotel específico

## PORTAS RECOMENDADAS

```bash
# Sistema Principal (Admin)
Porta: 8080 - www.exchangesistemas.com.br

# Hotéis (exemplos)
Porta: 8081 - maerainha.exchangesistemas.com.br
Porta: 8082 - hotelabc.exchangesistemas.com.br
Porta: 8083 - hoteldelta.exchangesistemas.com.br
Porta: 8084 - hotelepsilon.exchangesistemas.com.br
...
Porta: 8999 - último hotel possível
```

## SEGURANÇA

### 1. SSL/TLS
- Configure certificado SSL wildcard: `*.exchangesistemas.com.br`
- Ou certificados individuais por subdomínio

### 2. Isolamento
- Cada hotel acessa apenas seus próprios dados
- Middleware garante isolamento por subdomínio
- Usuários não podem acessar outros hotéis

### 3. Backup
- Backup único do banco (todos os hotéis)
- Configurar backup diário automático

## MANUTENÇÃO

### Adicionar Novo Hotel
1. Criar hotel no painel admin
2. Configurar proxy no EasyPanel
3. Configurar DNS (se necessário)
4. Testar acesso

### Remover Hotel
1. Desativar hotel no painel admin
2. Remover proxy do EasyPanel
3. Remover DNS (opcional)

### Atualizar Sistema
1. Fazer deploy da aplicação principal
2. Todos os hotéis são atualizados automaticamente
3. Não precisa atualizar cada proxy individualmente

## SOLUÇÃO DE PROBLEMAS

### Subdomínio Não Funciona
1. Verificar configuração DNS
2. Verificar proxy no EasyPanel
3. Verificar se hotel existe no banco

### Erro 500 no Hotel
1. Verificar logs do container principal
2. Verificar se porta está correta
3. Verificar configuração do proxy

### Hotel Não Encontrado
1. Verificar se subdomínio está correto no banco
2. Verificar se hotel está ativo
3. Limpar cache do navegador

## BENEFÍCIOS

1. **Multi-tenant Verdadeiro:** Cada hotel com sua identidade
2. **Escalável:** Adicione hotéis sem alterar código
3. **Centralizado:** Um painel admin para gerenciar tudo
4. **Profissional:** Subdomínios personalizados para cada cliente
5. **Econômico:** Uma instalação para múltiplos clientes

---

**Este sistema transforma seu Hotel Manager em uma verdadeira plataforma SaaS multi-tenant!**
