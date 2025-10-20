# Sistema de Autenticação

## 📋 Arquivos e Responsabilidades

- **auth.controller.ts** - Recebe as requisições HTTP (porteiro)
- **auth.service.ts** - Processa toda a lógica de negócio (cérebro)
- **auth.module.ts** - Conecta o controller com o service

## 🔐 Funções do Service

- `hashPassword()` - Criptografa senha com bcrypt
- `comparePasswords()` - Compara senha normal com criptografada
- `generateAccessToken()` - Gera token de acesso (15min)
- `generateRefreshToken()` - Gera token de renovação (7 dias)
- `saveRefreshToken()` - Salva refresh token no banco
- `register()` - Registra novo usuário
- `login()` - Faz login do usuário
- `refreshAccessToken()` - Renova o access token
- `validateUser()` - Valida se usuário existe
- `revokeRefreshToken()` - Revoga refresh token (logout)

## 📡 Status HTTP dos Endpoints

### POST /auth/register → 201 Created
Por quê? **Cria** um novo usuário no banco
Não precisa de `@HttpCode` (201 é padrão)

### POST /auth/login → 200 OK
Por quê? Apenas **valida** credenciais existentes
Precisa de `@HttpCode(HttpStatus.OK)`

### POST /auth/refresh → 200 OK
Por quê? Apenas **renova** token existente
Precisa de `@HttpCode(HttpStatus.OK)`

### POST /auth/logout → 200 OK
Por quê? Apenas **modifica** (revoga) token existente
Precisa de `@HttpCode(HttpStatus.OK)`

**Regra:** Use 201 para criar, 200 para validar/modificar
