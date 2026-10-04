import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { configValidationSchema } from './config/validation.js';
import { RequestLoggerMiddleware } from './common/request-logger.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
    }),
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
