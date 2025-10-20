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

# Copy api-gateway
COPY apps/api-gateway ./apps/api-gateway

WORKDIR /app/apps/api-gateway

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# Production build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/api-gateway ./apps/api-gateway

RUN npm install
RUN npm run build --filter=api-gateway

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/apps/api-gateway/package*.json ./
COPY --from=builder /app/packages ./packages

RUN npm install --production

EXPOSE 3000

CMD ["node", "dist/main.js"]


