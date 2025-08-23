import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('cs_papers')
@Index('idx_categories', ['allCategories'])
@Index('idx_update_date', ['updateDate'])
@Index('idx_created_at', ['createdAt'])
export class Paper {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 500 })
    title!: string;

    @Column({ length: 200, nullable: true })
    allCategories!: string;

    @Column({ nullable: true })
    authors!: string;

    @Column({ nullable: true })
    updateDate!: Date;

    @Column({ length: 500, nullable: true })
    url!: string;

    @Column()
    abstract!: string;

    @Column({ nullable: true })
    summary!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
