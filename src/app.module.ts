import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        STRIPE_SECRET_KEY: Joi.string(),
        STRIPE_CURRENCY: Joi.string(),
        FRONTEND_URL: Joi.string(),
        STRIPE_WEBHOOK_SECRET: Joi.string(),
        // ...
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
