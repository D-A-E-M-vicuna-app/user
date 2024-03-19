import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_GATEWAY_DOMAIN ? `https://${process.env.NEXT_PUBLIC_GATEWAY_DOMAIN}` : 'http://localhost:3002',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  });
  await app.listen(process.env.PORT || 3000);
  console.log("[*] Awaiting RPC requests user");

}
bootstrap();
