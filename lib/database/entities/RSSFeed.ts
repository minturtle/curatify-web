import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RSSUrl } from './RSSUrl';

@Entity('rss_feeds')
export class RSSFeed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  summary!: string;

  @Column({ type: 'timestamp', name: 'writed_at' })
  writedAt!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'original_url' })
  originalUrl!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // 관계 설정 - 문자열로 참조하여 순환 참조 방지
  @ManyToOne('RSSUrl', 'rssFeeds')
  @JoinColumn({ name: 'rss_url_id' })
  rssUrl!: Promise<RSSUrl>;
}
