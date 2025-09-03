import mongoose, { Document, Schema } from 'mongoose';

// Paper 인터페이스 정의
export interface IPaper extends Document {
  title: string;
  authors?: string;
  updateDate?: Date;
  url?: string;
  abstract: string;
  summary?: string;
  categoryIds?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Paper 스키마 정의
const PaperSchema = new Schema<IPaper>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    authors: {
      type: String,
      trim: true,
    },
    updateDate: {
      type: Date,
    },
    url: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    abstract: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PaperCategory',
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
    collection: 'papers',
  }
);

// 인덱스 설정
PaperSchema.index({ updateDate: -1 });
PaperSchema.index({ createdAt: -1 });
PaperSchema.index({ title: 'text', abstract: 'text' }); // 텍스트 검색 인덱스

// 가상 필드 (관계 데이터)
PaperSchema.virtual('paperContents', {
  ref: 'PaperContent',
  localField: '_id',
  foreignField: 'paperId',
});

PaperSchema.virtual('categories', {
  ref: 'PaperCategory',
  localField: '_id',
  foreignField: 'paperId',
});

PaperSchema.virtual('userLibraries', {
  ref: 'UserLibrary',
  localField: '_id',
  foreignField: 'paperId',
});

// JSON 변환 시 가상 필드 포함
PaperSchema.set('toJSON', { virtuals: true });
PaperSchema.set('toObject', { virtuals: true });

// 모델 생성 및 내보내기
export const Paper = mongoose.model<IPaper>('Paper', PaperSchema);
