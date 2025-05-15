import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { ProductHighlight } from './product-highlight.entity';
import { ProductSpecification } from './product-specification.entity';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true, default: '', type: 'text' })
  description: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ nullable: true })
  oldPrice: number;

  @Column({ default: false })
  isOnSale: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  origin: string;

  @Column({ nullable: true, type: 'text', select: false })
  specifications: string;

  @Column({ nullable: true, type: 'text', select: false })
  features: string;

  @Column({ nullable: true, type: 'text' })
  applications: string;

  @Column({ nullable: true })
  warranty: string;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  power: string;

  @Column({ nullable: true })
  workingSize: string;

  @Column({ nullable: true })
  speed: string;

  @Column({ nullable: true })
  motorPower: string;

  @Column({ nullable: true, type: 'text', select: false })
  highlights: string;

  @Column({ nullable: true })
  toolChangerCapacity: number;

  @Column({ nullable: true })
  spindleSpeed: string;

  @Column({ nullable: true })
  drillingUnit: string;

  @Column({ nullable: true })
  sawUnit: string;

  @Column({ nullable: true })
  vacuumPump: string;

  @Column({ nullable: true })
  controlSystem: string;

  @Column({ nullable: true })
  dustCollection: string;

  @Column({ nullable: true })
  airPressure: string;

  @Column({ nullable: true })
  productType: string;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductHighlight, (highlight) => highlight.product, { cascade: true })
  highlightItems: ProductHighlight[];

  @OneToMany(() => ProductSpecification, (spec) => spec.product, { cascade: true })
  specificationItems: ProductSpecification[];

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  orderCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 