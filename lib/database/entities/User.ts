import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RSSUrl } from './RSSUrl';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    name!: string;

    @Column({ default: false })
    isVerified!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // 관계 설정
    @OneToMany(() => RSSUrl, rssUrl => rssUrl.user)
    rssUrls!: RSSUrl[];
}
