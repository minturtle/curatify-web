import mongoose, { Document, Schema } from 'mongoose';

// RSSUrl 인터페이스 정의
export interface IRSSUrl extends Document {
  type: 'youtube' | 'normal';
  url: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// 최소한의 스키마 정의 (인덱스나 제약조건 없이)
const RSSUrlSchema = new Schema(
  {
    type: String,
    url: String,
    userId: Schema.Types.ObjectId,
    deletedAt: Date,
  },
  {
    timestamps: true,
    collection: 'rss_urls',
  }
);

// 모델이 이미 존재하는지 확인한 후 생성
export const RSSUrl = mongoose.models.RSSUrl || mongoose.model<IRSSUrl>('RSSUrl', RSSUrlSchema);
