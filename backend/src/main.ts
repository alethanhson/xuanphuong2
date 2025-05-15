import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { setDatabaseService as setAuthMiddlewareDatabaseService } from './middleware/auth.middleware';
import { setDatabaseService as setUserServiceDatabaseService } from './utils/user.service';

async function bootstrap() {
  console.log('Starting NestJS application...');
  
  const app = await NestFactory.create(AppModule);
  console.log('NestJS application created');
  
  // Lấy DatabaseService từ container và truyền vào các services/middlewares cần thiết
  const databaseService = app.get(DatabaseService);
  setAuthMiddlewareDatabaseService(databaseService);
  setUserServiceDatabaseService(databaseService);
  console.log('DatabaseService injected into services/middlewares');
  
  // Thêm global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  console.log('ValidationPipe registered');
  
  // Cấu hình CORS - sửa để giải quyết vấn đề CORS
  app.enableCors({
    origin: true, // Cho phép tất cả các origins trong môi trường phát triển
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  console.log('CORS enabled');
  
  // Xác định prefix API
  app.setGlobalPrefix('api');
  console.log('Global prefix set to: api');
  
  await app.listen(process.env.PORT || 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
