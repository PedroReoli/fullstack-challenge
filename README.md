# Fullstack Challenge - Task Management System

Sistema de gerenciamento de tarefas com microserviços usando NestJS, PostgreSQL, RabbitMQ e React.

## 🏗️ Arquitetura

Monorepo com Turborepo contendo:
- **API Gateway** - Gateway com JWT Guards e Swagger
- **Auth Service** - Serviço de autenticação
- **Task Service** - Serviço de tarefas (próximo)
- **Frontend** - React + Vite (próximo)

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- Docker + Docker Compose
- npm

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Subir serviços com Docker
docker-compose up -d

# 3. Verificar se está tudo rodando
docker-compose ps
```

### Serviços Disponíveis

- **API Gateway**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **Auth Service**: http://localhost:3002
- **PostgreSQL**: localhost:5432
- **RabbitMQ UI**: http://localhost:15672 (admin/admin)

## 📚 Documentação

- [Arquitetura](./docs/architecture.md) - Diagramas e fluxos
- [Sprint 1](./docs/sprints/sprint-1/README.md) - Checklist da Sprint 1
- [Auth Service](./apps/auth-service/README.md) - Documentação do Auth Service
- [API Gateway](./apps/api-gateway/README.md) - Documentação do API Gateway

## 🧪 Testando a API

### 1. Cadastrar Usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "password123"
  }'
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Testar Rota Protegida

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

Ou use o **Swagger UI** em http://localhost:3000/api/docs

## 📦 Estrutura do Monorepo

```
fullstack-challenge/
├── apps/
│   ├── api-gateway/        # Gateway principal
│   ├── auth-service/       # Serviço de autenticação
│   ├── task-service/       # Serviço de tarefas (próximo)
│   └── frontend/           # React app (próximo)
├── packages/
│   ├── types/              # Types compartilhados
│   └── tsconfig/           # Configs TypeScript
├── docs/                   # Documentação
├── docker-compose.yml      # Orquestração
└── turbo.json             # Config do Turborepo
```

## 🛠️ Comandos Úteis

```bash
# Parar todos os serviços
docker-compose down

# Ver logs em tempo real
docker-compose logs -f

# Limpar volumes (CUIDADO: apaga dados)
docker-compose down -v

# Rebuild dos containers
docker-compose up -d --build

# Rodar em modo desenvolvimento (sem Docker)
npm run dev

# Formatar código
npm run format
```

## 🔐 Variáveis de Ambiente

As variáveis já estão configuradas no `docker-compose.yml` para desenvolvimento.

Para produção, configure:
- `JWT_SECRET` - Secret para tokens
- `JWT_REFRESH_SECRET` - Secret para refresh tokens
- `DB_PASSWORD` - Senha do PostgreSQL
- `AUTH_SERVICE_URL` - URL do auth service

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Port already in use"
```bash
# Ver o que está usando a porta
netstat -ano | findstr :3000

# Parar containers
docker-compose down
```

### Resetar banco de dados
```bash
docker-compose down -v
docker-compose up -d
```

## 📋 Status do Projeto

### ✅ Concluído
- [x] Configuração do monorepo (Turborepo)
- [x] Docker Compose (PostgreSQL + RabbitMQ)
- [x] Auth Service completo
- [x] API Gateway com JWT Guards
- [x] Swagger/OpenAPI
- [x] Rate limiting

### 🔄 Em Andamento
- [ ] Task Service
- [ ] WebSocket para notificações
- [ ] Frontend React

## 👨‍💻 Desenvolvimento

```bash
# Instalar nova dependência em um app
cd apps/auth-service
npm install nome-do-pacote

# Adicionar novo app
mkdir apps/novo-app
cd apps/novo-app
npm init -y
```

## 📝 Licença

Este projeto faz parte de um processo seletivo.

## 👤 Autor

Pedro Lucas Reis de Oliveira Sousa
