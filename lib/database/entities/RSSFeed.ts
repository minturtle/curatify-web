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

@Entity('RSS_FEEDS')
export class RSSFeed {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ type: 'varchar', length: 500, name: 'TITLE' })
  title!: string;

  @Column({ type: 'clob', nullable: true, name: 'SUMMARY' })
  summary!: string;

  @Column({ type: 'timestamp', name: 'WRITED_AT' })
  writedAt!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'ORIGINAL_URL' })
  originalUrl!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @ManyToOne('RSSUrl', 'rssFeeds')
  @JoinColumn({ name: 'RSS_URL_ID' })
  rssUrl!: Promise<RSSUrl>;
}
