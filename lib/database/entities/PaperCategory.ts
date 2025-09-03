import mongoose, { Document, Schema } from 'mongoose';

// PaperCategory 인터페이스 정의
export interface IPaperCategory extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// 최소한의 스키마 정의 (인덱스나 제약조건 없이)
const PaperCategorySchema = new Schema(
  {
    name: String,
  },
  {
    timestamps: true,
    collection: 'cs_paper_categories',
  }
);

// 모델이 이미 존재하는지 확인한 후 생성
export const PaperCategory =
  mongoose.models.PaperCategory ||
  mongoose.model<IPaperCategory>('PaperCategory', PaperCategorySchema);
