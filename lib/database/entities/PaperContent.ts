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

@Entity('PAPER_CONTENT')
@Index('idx_paper_id', ['paperId'])
@Index('idx_created_at', ['createdAt'])
export class PaperContent {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ type: 'varchar', length: 500, name: 'CONTENT_TITLE' })
  contentTitle!: string;

  @Column({ type: 'clob', name: 'CONTENT' })
  content!: string;

  @Column({ type: 'number', default: 0, name: 'ORDER_NUM' })
  order!: number;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Column({ name: 'PAPER_ID' })
  paperId!: number;

  @ManyToOne('Paper', 'paperContents')
  @JoinColumn({ name: 'PAPER_ID' })
  paper!: Paper;
}
