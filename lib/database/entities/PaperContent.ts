import mongoose, { Document, Schema } from 'mongoose';

// PaperContent 인터페이스 정의
export interface IPaperContent extends Document {
  contentTitle: string;
  content: string;
  order: number;
  paperId: mongoose.Types.ObjectId;
  createdAt: Date;
}

// PaperContent 스키마 정의
const PaperContentSchema = new Schema<IPaperContent>(
  {
    contentTitle: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    paperId: {
      type: Schema.Types.ObjectId,
      ref: 'Paper',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // createdAt만 자동 생성
    collection: 'paper_content',
  }
);

// 인덱스 설정
PaperContentSchema.index({ paperId: 1 });
PaperContentSchema.index({ createdAt: -1 });
PaperContentSchema.index({ order: 1 });

// 가상 필드 (관계 데이터)
PaperContentSchema.virtual('paper', {
  ref: 'Paper',
  localField: 'paperId',
  foreignField: '_id',
  justOne: true,
});

// JSON 변환 시 가상 필드 포함
PaperContentSchema.set('toJSON', { virtuals: true });
PaperContentSchema.set('toObject', { virtuals: true });

// 모델 생성 및 내보내기
export const PaperContent = mongoose.model<IPaperContent>('PaperContent', PaperContentSchema);
