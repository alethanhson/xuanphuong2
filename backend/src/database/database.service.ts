import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductHighlight } from './entities/product-highlight.entity';
import { ProductSpecification } from './entities/product-specification.entity';

@Injectable()
export class DatabaseService {
  public product: Repository<Product>;
  public productImage: Repository<ProductImage>;
  public productHighlight: Repository<ProductHighlight>;
  public productSpecification: Repository<ProductSpecification>;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    
    private readonly dataSource: DataSource,
  ) {
    this.product = this.dataSource.getRepository(Product);
    this.productImage = this.dataSource.getRepository(ProductImage);
    this.productHighlight = this.dataSource.getRepository(ProductHighlight);
    this.productSpecification = this.dataSource.getRepository(ProductSpecification);
  }

  get user() {
    return this.userRepository;
  }

  get category() {
    return this.categoryRepository;
  }
} 