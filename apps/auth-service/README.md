# Auth Service 

Serviço de autenticação usando NestJS com JWT tokens.

## Estrutura

```
src/
├── auth/              # Módulo principal de autenticação
│   ├── auth.controller.ts  # Recebe requisições HTTP
│   ├── auth.service.ts     # Lógica de negócio
│   └── auth.module.ts      # Configurações do módulo
├── dto/               # Validação de dados
│   ├── register.dto.ts     # Validações de cadastro
│   ├── login.dto.ts        # Validações de login
│   └── refresh-token.dto.ts
├── entities/          # Tabelas do banco
│   ├── user.entity.ts
│   └── refresh-token.entity.ts
├── app.module.ts      # Módulo raiz (conecta tudo)
└── main.ts            # Ponto de entrada da aplicação
```

## Fluxo 

1. **main.ts** → Inicia a aplicação
2. **app.module.ts** → Conecta banco, variáveis e módulos
3. **Controller** → Recebe requisições (recepcionista)
4. **DTO** → Valida os dados antes de processar
5. **Service** → Processa a lógica (cérebro)
6. **Repository** → Acessa o banco de dados

## Endpoints

- `POST /auth/register` - Cadastrar usuário
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Renovar access token
- `POST /auth/logout` - Fazer logout

## Tecnologias

- NestJS (framework)
- TypeScript
- PostgreSQL (banco)
- JWT (autenticação)
- bcrypt (hash de senha)