import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rawBodyMiddleware from './middleware/raw.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(rawBodyMiddleware());
  app.enableCors();
  await app.listen(4242);
}
bootstrap();
