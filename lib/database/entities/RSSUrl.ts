import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { RSSFeed } from './RSSFeed';

@Entity('rss_urls')
export class RSSUrl {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: ['youtube', 'normal'] })
    type!: 'youtube' | 'normal';

    @Column()
    url!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // 관계 설정
    @ManyToOne(() => User, user => user.rssUrls)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column()
    userId!: number;

    @OneToMany(() => RSSFeed, rssFeed => rssFeed.rssUrl)
    rssItems!: RSSFeed[];
}
