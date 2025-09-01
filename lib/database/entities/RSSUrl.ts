import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { RSSFeed } from './RSSFeed';

@Entity('RSS_URLS')
export class RSSUrl {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ type: 'varchar', length: 20, name: 'TYPE' })
  type!: 'youtube' | 'normal';

  @Column({ type: 'varchar', length: 500, name: 'URL' })
  url!: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT', nullable: true })
  deletedAt!: Date | null;

  // 관계 설정 - 문자열로 참조하여 순환 참조 방지
  @ManyToOne('User', 'rssUrls')
  @JoinColumn({ name: 'USER_ID' })
  user!: User;

  @OneToMany('RSSFeed', 'rssUrl')
  rssFeeds!: RSSFeed[];
}
