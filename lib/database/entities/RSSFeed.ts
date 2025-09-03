import mongoose, { Document, Schema } from 'mongoose';

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

// RSSFeed 스키마 정의
const RSSFeedSchema = new Schema<IRSSFeed>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    writedAt: {
      type: Date,
      required: true,
    },
    originalUrl: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    rssUrlId: {
      type: Schema.Types.ObjectId,
      ref: 'RSSUrl',
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
    collection: 'rss_feeds',
  }
);

// 인덱스 설정
RSSFeedSchema.index({ rssUrlId: 1 });
RSSFeedSchema.index({ writedAt: -1 });
RSSFeedSchema.index({ createdAt: -1 });
RSSFeedSchema.index({ title: 'text', summary: 'text' }); // 텍스트 검색 인덱스

// 가상 필드 (관계 데이터)
RSSFeedSchema.virtual('rssUrl', {
  ref: 'RSSUrl',
  localField: 'rssUrlId',
  foreignField: '_id',
  justOne: true,
});

// JSON 변환 시 가상 필드 포함
RSSFeedSchema.set('toJSON', { virtuals: true });
RSSFeedSchema.set('toObject', { virtuals: true });

// 모델 생성 및 내보내기
export const RSSFeed = mongoose.model<IRSSFeed>('RSSFeed', RSSFeedSchema);
