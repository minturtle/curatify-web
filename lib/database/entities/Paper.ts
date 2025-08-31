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

@Entity('papers')
@Index('idx_update_date', ['updateDate'])
@Index('idx_created_at', ['createdAt'])
export class Paper {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  authors!: string;

  @Column({ type: 'timestamp', nullable: true, name: 'update_date' })
  updateDate!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  url!: string;

  @Column({ type: 'text' })
  abstract!: string;

  @Column({ type: 'text', nullable: true })
  summary!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany('PaperContent', 'paper')
  paperContents!: Promise<PaperContent[]>;

  @ManyToMany('PaperCategory', 'papers')
  categories!: Promise<PaperCategory[]>;

  @OneToMany('UserLibrary', 'paper')
  userLibraries!: Promise<UserLibrary[]>;
}
