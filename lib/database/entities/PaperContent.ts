import mongoose, { Document, Schema } from 'mongoose';

// PaperContent 인터페이스 정의
export interface IPaperContent extends Document {
  contentTitle: string;
  content: string;
  order: number;
  paper:
    | mongoose.Types.ObjectId
    | {
        _id: mongoose.Types.ObjectId;
        title: string;
        authors?: string;
        abstract?: string;
        url?: string;
        updateDate?: Date;
        createdAt: Date;
      };
  createdAt: Date;
}

// 최소한의 스키마 정의 (인덱스나 제약조건 없이)
const PaperContentSchema = new Schema(
  {
    contentTitle: String,
    content: String,
    order: Number,
    paper: {
      type: Schema.Types.ObjectId,
      ref: 'Paper',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'paper_content',
  }
);

// 모델이 이미 존재하는지 확인한 후 생성
export const PaperContent =
  mongoose.models.PaperContent || mongoose.model<IPaperContent>('PaperContent', PaperContentSchema);
