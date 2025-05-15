import { Module } from '@nestjs/common';
import { AdminSeedController } from './admin-seed.controller';
import { AdminProductsController } from './admin-products.controller';
import { AdminCategoriesController } from './admin-categories.controller';
import { ProductUploadController } from './product-upload/product-upload.controller';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    UsersModule, 
    PrismaModule,
    DatabaseModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [
    AdminSeedController, 
    AdminProductsController,
    AdminCategoriesController,
    ProductUploadController
  ],
})
export class AdminModule {}
