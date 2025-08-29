import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('rss_urls')
export class RSSUrl {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: ['youtube', 'normal'] })
    type!: 'youtube' | 'normal';

    @Column({ type: 'varchar', length: 500 })
    url!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // 관계 설정 - 문자열로 참조하여 순환 참조 방지
    @ManyToOne('User', 'rssUrls')
    @JoinColumn({ name: 'user_id' })
    user!: any;

    @Column({ type: 'int' })
    userId!: number;

    @OneToMany('RSSFeed', 'rssUrl')
    rssFeeds!: any[];
}
