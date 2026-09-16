import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow the React dev server (port 5173) and any deployed frontend origin.
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validate and transform all incoming DTOs automatically.
  // whitelist: strip unknown properties so the DB never receives garbage.
  // forbidNonWhitelisted: return 400 when unknown properties are sent.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Normalise all error responses into a consistent JSON shape.
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Wrap all successful responses: { success: true, data: ... }
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
