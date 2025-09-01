import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { RSSUrl } from './RSSUrl';
import type { UserLibrary } from './UserLibrary';
import type { UserInterests } from './UserInterests';

@Entity('USERS')
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ type: 'varchar', unique: true, name: 'EMAIL' })
  email!: string;

  @Column({ type: 'varchar', name: 'PASSWORD' })
  password!: string;

  @Column({ type: 'varchar', nullable: true, name: 'NAME' })
  name!: string;

  @Column({ type: 'number', default: 0, name: 'IS_VERIFIED', transformer: { to: (value: boolean) => value ? 1 : 0, from: (value: number) => value === 1 } })
  isVerified!: boolean;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @OneToMany('RSSUrl', 'user')
  rssUrls!: Promise<RSSUrl[]>;

  @OneToMany('UserLibrary', 'user')
  userLibraries!: Promise<UserLibrary[]>;

  @OneToMany('UserInterests', 'user')
  interests!: Promise<UserInterests[]>;
}
