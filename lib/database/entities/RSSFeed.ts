import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RSSUrl } from './RSSUrl';

@Entity('rss_feeds')
export class RSSFeed {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: true })
    summary!: string;

    @Column({ type: 'timestamp' })
    writedAt!: Date;

    @Column({ nullable: true })
    originalUrl!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // 관계 설정
    @ManyToOne(() => RSSUrl, rssUrl => rssUrl.rssItems)
    @JoinColumn({ name: 'rssUrlId' })
    rssUrl!: RSSUrl;

    @Column()
    rssUrlId!: number;
}
