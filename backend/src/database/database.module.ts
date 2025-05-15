import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductHighlight } from './entities/product-highlight.entity';
import { ProductSpecification } from './entities/product-specification.entity';
import { DatabaseService } from './database.service';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get('DB_TYPE', 'sqlite');
        
        if (dbType === 'sqlite') {
          return {
            type: 'better-sqlite3',
            database: join(
              process.cwd(),
              'data', 
              configService.get('DB_DATABASE', 'database.sqlite')
            ),
            entities: [User, Product, Category, ProductImage, ProductHighlight, ProductSpecification],
            synchronize: configService.get('NODE_ENV') !== 'production',
            autoLoadEntities: true
          } as const;
        } 
        
        return {
          type: 'mysql',
          host: configService.get('DB_HOST', 'mysql'),
          port: configService.get<number>('DB_PORT', 3306),
          username: configService.get('DB_USERNAME', 'root'),
          password: configService.get<string>('DB_PASSWORD', 'root'),
          database: configService.get('DB_DATABASE', 'xuanphuong'),
          entities: [User, Product, Category, ProductImage, ProductHighlight, ProductSpecification],
          synchronize: configService.get('NODE_ENV') !== 'production',
          autoLoadEntities: true
        } as const;
      },
    }),
    TypeOrmModule.forFeature([User, Product, Category, ProductImage, ProductHighlight, ProductSpecification]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {} 