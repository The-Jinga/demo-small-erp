import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('approval_logs')
export class ApprovalLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approvedBy' })
  approvedBy: User;

  @Column({ type: 'text' })
  action: 'approved' | 'rejected';

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
