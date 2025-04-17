import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { PurchaseOrder } from '../../purchase-order/entities/purchase-order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('inventory_transactions')
export class InventoryTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'text' })
  type: 'stock_in' | 'stock_out';

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => PurchaseOrder, { nullable: true })
  @JoinColumn({ name: 'relatedPoId' })
  relatedPo: PurchaseOrder;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performedBy' })
  performedBy: User;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
