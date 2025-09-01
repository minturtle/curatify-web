import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import type { Paper } from './Paper';

@Entity('CS_PAPER_CATEGORIES')
@Index('idx_category_name', ['name'])
export class PaperCategory {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'NAME' })
  name!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @ManyToMany('Paper', 'categories')
  @JoinTable({
    name: 'CS_PAPER_CATEGORY_RELATIONS',
    joinColumn: {
      name: 'CATEGORY_ID',
    },
    inverseJoinColumn: {
      name: 'PAPER_ID',
    },
  })
  papers!: Promise<Paper[]>;
}
