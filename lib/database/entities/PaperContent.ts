import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import type { Paper } from './Paper';
import type { UserLibrary } from './UserLibrary';

@Entity('paper_content')
@Index('idx_paper_id', ['paperId'])
@Index('idx_created_at', ['createdAt'])
export class PaperContent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  authors!: string;

  @Column({ type: 'longtext' })
  content!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'paper_id' })
  paperId!: number;

  @ManyToOne('Paper', 'paperContents')
  @JoinColumn({ name: 'paper_id' })
  paper!: Paper;

  @OneToMany('UserLibrary', 'paperContent')
  userLibraries!: Promise<UserLibrary[]>;
}
