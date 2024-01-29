import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3002',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  
  })
  await app.listen(3000);
  console.log("[*] Awaiting RPC requests user");

}
bootstrap();
