import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS — allows React frontend to call this API
  app.enableCors({
    origin: [
      'http://localhost',
      'http://127.0.0.1',
      'http://localhost:80',
      'http://localhost:5173',
      'http://ec2-13-62-103-99.eu-north-1.compute.amazonaws.com',
      'http://ec2-13-62-103-99.eu-north-1.compute.amazonaws.com:80',
      'http://ec2-13-62-103-99.eu-north-1.compute.amazonaws.com:5173',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe — validates all DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter — consistent error format
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('MO Marketplace API')
    .setDescription('Full-Stack Assessment — Products, Variants, JWT Auth')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('products')
    .addTag('variants')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger at /api

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ API running on http://localhost:${port}`);
  console.log(`📖 Swagger docs at http://localhost:${port}/api`);
}

bootstrap();
