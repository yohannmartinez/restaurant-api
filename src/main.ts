import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';


/**
 * Initializes and bootstraps the NestJS application.
 *
 * The `bootstrap` function is the entry point of the application. It sets up the application
 * with necessary configurations such as CORS, cookie parsing, and graceful shutdown.
 * The function also configures the logger based on the environment and starts the HTTP server.
 */
async function bootstrap(): Promise<void> {
  // Create the NestJS application instance, using a custom logger if the production environment variable is on
  // Production in Radiofrance infrastructures mean: a hosted environment (eg: Staging)
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({
    origin: [

    ],
    credentials: true,
  });

  // Use cookie-parser middleware to parse cookies in the HTTP requests
  app.use(cookieParser());

  // Setup graceful shutdown to handle termination signals and cleanup
  setupGracefulShutdown({ app });
  // Start the application and listen on the specified port and host
  await app.listen(3000, '0.0.0.0');
}

// Execute the bootstrap function to start the application
bootstrap();
