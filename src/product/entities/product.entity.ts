import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  category: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 0 })
  pendingStock: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
