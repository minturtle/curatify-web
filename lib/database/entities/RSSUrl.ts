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

// RSSUrl 스키마 정의
const RSSUrlSchema = new Schema<IRSSUrl>(
  {
    type: {
      type: String,
      required: true,
      enum: ['youtube', 'normal'],
      default: 'normal',
    },
    url: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
    collection: 'rss_urls',
  }
);

// 인덱스 설정
RSSUrlSchema.index({ userId: 1 });
RSSUrlSchema.index({ type: 1 });
RSSUrlSchema.index({ url: 1 });
RSSUrlSchema.index({ createdAt: -1 });

// 가상 필드 (관계 데이터)
RSSUrlSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

RSSUrlSchema.virtual('rssFeeds', {
  ref: 'RSSFeed',
  localField: '_id',
  foreignField: 'rssUrlId',
});

// JSON 변환 시 가상 필드 포함
RSSUrlSchema.set('toJSON', { virtuals: true });
RSSUrlSchema.set('toObject', { virtuals: true });

// 모델 생성 및 내보내기
export const RSSUrl = mongoose.model<IRSSUrl>('RSSUrl', RSSUrlSchema);
