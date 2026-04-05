import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  color!: string;

  @Column()
  size!: string;

  @Column()
  material!: string;

  // This is the uniqueness key: "red-M-cotton"
  // Index ensures fast lookup; unique:true prevents duplicates per product
  @Column()
  @Index()
  combination_key!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceModifier!: number; // Extra cost on top of base price

  @Column({ default: 0 })
  stockQuantity!: number; // 0 means out-of-stock

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => Product, (product: Product) => product.variants, {
    onDelete: 'CASCADE', // Delete variants when product is deleted
  })
  product!: Product;

  @Column()
  productId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
