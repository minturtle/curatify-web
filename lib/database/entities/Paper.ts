import mongoose, { Document, Schema } from 'mongoose';

// ContentBlock 인터페이스 정의
export interface IContentBlock {
  contentTitle: string;
  content: string;
  order: number;
}

// Paper 인터페이스 정의
export interface IPaper extends Document {
  title: string;
  authors?: string;
  updateDate?: Date;
  url?: string;
  abstract: string;
  summary?: string;
  categories?: string[];
  contentBlocks: IContentBlock[];
  createdAt: Date;
  updatedAt: Date;
}

// 최소한의 스키마 정의 (인덱스나 제약조건 없이)
const PaperSchema = new Schema(
  {
    title: String,
    authors: String,
    updateDate: Date,
    url: String,
    abstract: String,
    summary: String,
    categories: [String],
    contentBlocks: [
      {
        contentTitle: String,
        content: String,
        order: Number,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'papers',
  }
);

// 모델이 이미 존재하는지 확인한 후 생성
export const Paper = mongoose.models.Paper || mongoose.model<IPaper>('Paper', PaperSchema);
