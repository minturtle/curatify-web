import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('USER_INTERESTS')
export class UserInterests {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'USER_ID' })
  userId!: number;

  @Column({ type: 'varchar', length: 300, name: 'CONTENT' })
  content!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.interests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'USER_ID' })
  user!: User;
}
