import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('rss_feeds')
export class RSSFeed {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 500 })
    title!: string;

    @Column({ type: 'text', nullable: true })
    summary!: string;

    @Column({ type: 'timestamp' })
    writedAt!: Date;

    @Column({ type: 'varchar', length: 500, nullable: true })
    originalUrl!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // 관계 설정 - 문자열로 참조하여 순환 참조 방지
    @ManyToOne('RSSUrl', 'rssFeeds')
    @JoinColumn({ name: 'rssUrlId' })
    rssUrl!: any;

    @Column({ type: 'int' })
    rssUrlId!: number;
}
