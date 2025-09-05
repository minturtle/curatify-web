import mongoose, { Document, Schema } from 'mongoose';

// RSSFeed 인터페이스 정의
export interface IRSSFeed extends Document {
  title: string;
  summary?: string;
  writedAt: Date;
  originalUrl?: string;
  rssUrl: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId; name?: string; url?: string };
  createdAt: Date;
  updatedAt: Date;
}

// 최소한의 스키마 정의 (인덱스나 제약조건 없이)
const RSSFeedSchema = new Schema(
  {
    title: String,
    summary: String,
    writedAt: Date,
    originalUrl: String,
    rssUrl: {
      type: Schema.Types.ObjectId,
      ref: 'RSSUrl',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'rss_feeds',
  }
);

// 모델이 이미 존재하는지 확인한 후 생성
export const RSSFeed =
  mongoose.models.RSSFeed || mongoose.model<IRSSFeed>('RSSFeed', RSSFeedSchema);
