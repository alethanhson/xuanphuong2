import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { ProductsModule } from './modules/products/products.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { TestModule } from './modules/test/test.module';
import { DatabaseModule } from './database/database.module';
import { ProductHighlight } from './database/entities/product-highlight.entity';
import { ProductSpecification } from './database/entities/product-specification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      ProductHighlight,
      ProductSpecification,
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    AdminModule,
    ProductsModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
