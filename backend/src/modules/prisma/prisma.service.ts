import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    // Không cần kết nối gì nữa vì TypeORM sẽ tự kết nối
  }

  async onModuleDestroy() {
    // Không cần ngắt kết nối gì nữa vì TypeORM sẽ tự ngắt kết nối
  }

  get user() {
    return this.databaseService.user;
  }

  get product() {
    return this.databaseService.product;
  }

  get category() {
    return this.databaseService.category;
  }

  get productImage() {
    return this.databaseService.productImage;
  }
} 