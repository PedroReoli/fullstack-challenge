import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';

// Módulo raiz do API Gateway
@Module({
  imports: [
    // Configuração de variáveis de ambiente (.env)
    ConfigModule.forRoot({
      isGlobal: true, // disponível em toda aplicação
      envFilePath: '.env',
    }),
    // Rate limiting - 10 requisições por segundo
    ThrottlerModule.forRoot([
      {
        ttl: 1000, // 1 segundo
        limit: 10, // 10 requisições
      },
    ]),
    // Módulo de autenticação (proxy para auth-service)
    AuthModule,
  ],
})
export class AppModule {}


