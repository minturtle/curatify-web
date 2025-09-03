import mongoose, { Document } from 'mongoose';

// RSSUrl 인터페이스 정의
export interface IRSSUrl extends Document {
  type: 'youtube' | 'normal';
  url: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// 모델이 이미 존재하는지 확인한 후 생성
export const RSSUrl =
  mongoose.models.RSSUrl || mongoose.model<IRSSUrl>('RSSUrl', new mongoose.Schema({}));
