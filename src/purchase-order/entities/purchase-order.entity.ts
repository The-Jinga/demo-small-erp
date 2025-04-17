import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PurchaseOrderStatus } from '../../common/enums';
import { User } from '../../users/entities/user.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Supplier } from '../../supplier/entities/supplier.entity';
import { ApprovalLog } from './approval-log.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, {
    cascade: true,
  })
  items: PurchaseOrderItem[];

  @OneToOne(() => ApprovalLog, (approvalLog) => approvalLog.purchaseOrder)
  approvalLog: ApprovalLog;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
  })
  status: PurchaseOrderStatus;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  totalAmount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
