import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa validação global dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não esperados
      forbidNonWhitelisted: true, // rejeita requisições com campos extras
      transform: true, // transforma dados automaticamente
    })
  );

  // Ativa CORS para permitir requisições do frontend
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(`🚀 Auth Service is running on: http://localhost:${port}`);
}

bootstrap();

