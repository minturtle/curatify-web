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
import type { PaperContent } from './PaperContent';

@Entity('user_library')
@Index('idx_user_id', ['userId'])
@Index('idx_paper_content_id', ['paperContentId'])
@Index('idx_created_at', ['createdAt'])
export class UserLibrary {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'paper_content_id' })
  paperContentId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne('User', 'userLibraries')
  @JoinColumn({ name: 'user_id' })
  user!: Promise<User>;

  @ManyToOne('PaperContent', 'userLibraries')
  @JoinColumn({ name: 'paper_content_id' })
  paperContent!: Promise<PaperContent>;
}
