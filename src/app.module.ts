import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
  ],
  controllers: [AppController],
  exports: [AppModule]
})
export class AppModule {
}
