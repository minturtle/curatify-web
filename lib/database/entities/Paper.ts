import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import type { PaperContent } from './PaperContent';
import type { PaperCategory } from './PaperCategory';
import type { UserLibrary } from './UserLibrary';

@Entity('PAPERS')
@Index('idx_update_date', ['updateDate'])
@Index('idx_created_at', ['createdAt'])
export class Paper {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ type: 'varchar', length: 500, name: 'TITLE' })
  title!: string;

  @Column({ type: 'clob', nullable: true, name: 'AUTHORS' })
  authors!: string;

  @Column({ type: 'timestamp', nullable: true, name: 'UPDATE_DATE' })
  updateDate!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'URL' })
  url!: string;

  @Column({ type: 'clob', name: 'ABSTRACT' })
  abstract!: string;

  @Column({ type: 'clob', nullable: true, name: 'SUMMARY' })
  summary!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @OneToMany('PaperContent', 'paper')
  paperContents!: Promise<PaperContent[]>;

  @ManyToMany('PaperCategory', 'papers')
  categories!: Promise<PaperCategory[]>;

  @OneToMany('UserLibrary', 'paper')
  userLibraries!: Promise<UserLibrary[]>;
}
