# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY turbo.json ./

# Copy workspace packages
COPY packages ./packages

# Install dependencies
RUN npm install

# Copy auth-service
COPY apps/auth-service ./apps/auth-service

WORKDIR /app/apps/auth-service

EXPOSE 3002

CMD ["npm", "run", "start:dev"]

# Production build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/auth-service ./apps/auth-service

RUN npm install
RUN npm run build --filter=auth-service

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/apps/auth-service/dist ./dist
COPY --from=builder /app/apps/auth-service/package*.json ./
COPY --from=builder /app/packages ./packages

RUN npm install --production

EXPOSE 3002

CMD ["node", "dist/main.js"]

