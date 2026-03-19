import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  app.use(cookieParser());

  setupGracefulShutdown({ app });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();