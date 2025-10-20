import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';

// Módulo raiz - conecta todos os outros módulos da aplicação
@Module({
  imports: [
    // Configuração de variáveis de ambiente (.env)
    ConfigModule.forRoot({
      isGlobal: true, // disponível em toda aplicação
      envFilePath: '.env',
    }),
    // Configuração da conexão com PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'challenge_db'),
        entities: [User, RefreshToken], // tabelas do banco
        synchronize: configService.get('NODE_ENV') === 'development', // auto-sync apenas em dev
        logging: configService.get('NODE_ENV') === 'development', // logs apenas em dev
      }),
    }),
    // Módulo de autenticação (controller, service, etc)
    AuthModule,
  ],
})
export class AppModule {}

