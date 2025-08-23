import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

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

    // 관계 설정 - 문자열로 참조하여 순환 참조 방지
    @ManyToOne('User', 'rssUrls')
    @JoinColumn({ name: 'userId' })
    user!: any;

    @Column()
    userId!: number;

    @OneToMany('RSSFeed', 'rssUrl')
    rssFeeds!: any[];
}
