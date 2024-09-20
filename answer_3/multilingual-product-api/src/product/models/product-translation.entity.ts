import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.translations)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Index('idx_product_translation_language')
  @Column({ length: 2 })
  language: string;

  @Index('idx_product_translation_name')
  @Column()
  name: string;

  @Column()
  description: string;
}
