import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  creditLimit: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
