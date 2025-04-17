import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  action: string;

  @Column({ type: 'text' })
  entityType: string;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'jsonb' })
  changes: object;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
