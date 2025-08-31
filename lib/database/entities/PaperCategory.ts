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

@Entity('cs_paper_categories')
@Index('idx_category_name', ['name'])
export class PaperCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToMany('Paper', 'categories')
  @JoinTable({
    name: 'cs_paper_category_relations',
    joinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'paper_id',
      referencedColumnName: 'id',
    },
  })
  papers!: Promise<Paper[]>;
}
