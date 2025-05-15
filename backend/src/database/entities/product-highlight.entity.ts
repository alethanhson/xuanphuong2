import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_highlights')
export class ProductHighlight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column({ 
    type: 'varchar', 
    length: 255, 
    nullable: false, 
    default: 'Tính năng', 
  })
  title: string;

  @Column({ 
    type: 'text', 
    nullable: false, 
    default: 'Đang cập nhật thông tin tính năng', 
  })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  icon: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Product, (product) => product.highlightItems)
  @JoinColumn({ name: 'productId' })
  product: Product;
} 