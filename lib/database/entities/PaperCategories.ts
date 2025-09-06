import mongoose, { Document, Schema } from 'mongoose';

// PaperCategory 인터페이스 정의
export interface IPaperCategory extends Document {
  code: string;
  description: string;
}

// 스키마 정의
const PaperCategorySchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'paper_categories',
  }
);

// 모델이 이미 존재하는지 확인한 후 생성
export const PaperCategory =
  mongoose.models.PaperCategory ||
  mongoose.model<IPaperCategory>('PaperCategory', PaperCategorySchema);
