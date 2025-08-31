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

@Entity('user_library')
@Index('idx_user_id', ['userId'])
@Index('idx_paper_id', ['paperId'])
@Index('idx_created_at', ['createdAt'])
export class UserLibrary {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'paper_id' })
  paperId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne('User', 'userLibraries')
  @JoinColumn({ name: 'user_id' })
  user!: Promise<User>;

  @ManyToOne('Paper', 'userLibraries')
  @JoinColumn({ name: 'paper_id' })
  paper!: Promise<Paper>;
}
