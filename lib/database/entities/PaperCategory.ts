import mongoose, { Document, Schema } from 'mongoose';

// PaperCategory 인터페이스 정의
export interface IPaperCategory extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// PaperCategory 스키마 정의
const PaperCategorySchema = new Schema<IPaperCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
    collection: 'cs_paper_categories',
  }
);

// 인덱스 설정
PaperCategorySchema.index({ name: 1 });
PaperCategorySchema.index({ createdAt: -1 });

// 가상 필드 (관계 데이터)
PaperCategorySchema.virtual('papers', {
  ref: 'Paper',
  localField: '_id',
  foreignField: 'categoryIds',
});

// JSON 변환 시 가상 필드 포함
PaperCategorySchema.set('toJSON', { virtuals: true });
PaperCategorySchema.set('toObject', { virtuals: true });

// 모델 생성 및 내보내기
export const PaperCategory = mongoose.model<IPaperCategory>('PaperCategory', PaperCategorySchema);
