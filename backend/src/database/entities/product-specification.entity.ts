import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_specifications')
export class ProductSpecification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column({ nullable: true, default: '' })
  name: string;

  @Column({ type: 'text', nullable: true, default: '' })
  value: string;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  group: string;

  @ManyToOne(() => Product, (product) => product.specificationItems)
  @JoinColumn({ name: 'productId' })
  product: Product;
} 