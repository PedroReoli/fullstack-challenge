# API Gateway

Gateway centralizado com autenticação JWT, Swagger e rate limiting.

## Estrutura

```
src/
├── auth/              # Módulo de autenticação (proxy)
│   ├── auth.controller.ts  # Endpoints de auth
│   ├── auth.service.ts     # Proxy para auth-service
│   ├── auth.module.ts      # Configurações do módulo
│   ├── dto/                # DTOs com Swagger
│   ├── guards/             # JWT Guard
│   └── strategies/         # JWT Strategy
├── app.module.ts      # Módulo raiz
└── main.ts            # Ponto de entrada + Swagger
```

## Funcionalidades

### Proxy de Autenticação
Todas as requisições de `/auth/*` são redirecionadas para o `auth-service`

### JWT Guard
Protege rotas que precisam de autenticação:
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
async protectedRoute() { ... }
```

### Swagger
Documentação automática em: `http://localhost:3000/api/docs`
- Suporte a autenticação Bearer JWT
- Exemplos de requisição/resposta
- Testável diretamente pela interface

### Rate Limiting
Limitação de 10 requisições por segundo por IP

## Endpoints

### Autenticação (proxy para auth-service)
- `POST /auth/register` - Cadastrar usuário
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Renovar access token
- `POST /auth/logout` - Fazer logout
- `GET /auth/me` - Obter dados do usuário (protegido)

## Variáveis de Ambiente

```env
PORT=3000
NODE_ENV=development
AUTH_SERVICE_URL=http://localhost:3002
JWT_SECRET=same-secret-as-auth-service
JWT_ACCESS_EXPIRATION=15m
```

## Tecnologias

- NestJS (framework)
- Swagger/OpenAPI (documentação)
- Passport + JWT (autenticação)
- Throttler (rate limiting)
- Axios (HTTP client)


