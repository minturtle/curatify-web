import mongoose, { Document } from 'mongoose';

// PaperContent 인터페이스 정의
export interface IPaperContent extends Document {
  contentTitle: string;
  content: string;
  order: number;
  paperId: mongoose.Types.ObjectId;
  createdAt: Date;
}

// 모델이 이미 존재하는지 확인한 후 생성
export const PaperContent =
  mongoose.models.PaperContent ||
  mongoose.model<IPaperContent>('PaperContent', new mongoose.Schema({}));
