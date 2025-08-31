import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { Paper } from './Paper';

@Entity('paper_content')
@Index('idx_paper_id', ['paperId'])
@Index('idx_created_at', ['createdAt'])
export class PaperContent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 500, name: 'content_title' })
  contentTitle!: string;

  @Column({ type: 'longtext' })
  content!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'paper_id' })
  paperId!: number;

  @ManyToOne('Paper', 'paperContents')
  @JoinColumn({ name: 'paper_id' })
  paper!: Paper;
}
