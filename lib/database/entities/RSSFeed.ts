import mongoose, { Document } from 'mongoose';

// RSSFeed 인터페이스 정의
export interface IRSSFeed extends Document {
  title: string;
  summary?: string;
  writedAt: Date;
  originalUrl?: string;
  rssUrlId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// 모델이 이미 존재하는지 확인한 후 생성
export const RSSFeed =
  mongoose.models.RSSFeed || mongoose.model<IRSSFeed>('RSSFeed', new mongoose.Schema({}));
