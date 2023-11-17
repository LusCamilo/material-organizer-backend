import { NestFactory } from '@nestjs/core';
import "dotenv/config"
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { applyAppMiddleware } from './utils/apply-app-middleware';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyAppMiddleware(app)
  const port = parseInt(process.env.PORT || "6000")
  await app.listen(port);
  console.log(`Iniciou o Servidor em: http://localhost:${port}`)
  console.log(`Playground: http://localhost:${port}/graphql`)
}
bootstrap();
