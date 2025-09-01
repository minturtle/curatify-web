import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { User } from './User';
import type { Paper } from './Paper';

@Entity('USER_LIBRARY')
@Index('idx_user_id', ['userId'])
@Index('idx_paper_id', ['paperId'])
@Index('idx_created_at', ['createdAt'])
export class UserLibrary {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'USER_ID' })
  userId!: number;

  @Column({ name: 'PAPER_ID' })
  paperId!: number;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @ManyToOne('User', 'userLibraries')
  @JoinColumn({ name: 'USER_ID' })
  user!: Promise<User>;

  @ManyToOne('Paper', 'userLibraries')
  @JoinColumn({ name: 'PAPER_ID' })
  paper!: Promise<Paper>;
}
