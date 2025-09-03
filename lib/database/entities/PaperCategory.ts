import mongoose, { Document } from 'mongoose';

// PaperCategory 인터페이스 정의
export interface IPaperCategory extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// 모델이 이미 존재하는지 확인한 후 생성
export const PaperCategory =
  mongoose.models.PaperCategory ||
  mongoose.model<IPaperCategory>('PaperCategory', new mongoose.Schema({}));
