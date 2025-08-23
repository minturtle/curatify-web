import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('cs_papers')
@Index('idx_categories', ['allCategories'])
@Index('idx_update_date', ['updateDate'])
@Index('idx_created_at', ['createdAt'])
export class Paper {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 500 })
    title!: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    allCategories!: string;

    @Column({ type: 'text', nullable: true })
    authors!: string;

    @Column({ type: 'timestamp', nullable: true })
    updateDate!: Date;

    @Column({ type: 'varchar', length: 500, nullable: true })
    url!: string;

    @Column({ type: 'text' })
    abstract!: string;

    @Column({ type: 'text', nullable: true })
    summary!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
