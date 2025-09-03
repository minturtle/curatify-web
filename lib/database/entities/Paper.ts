import mongoose, { Document } from 'mongoose';

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

// 모델이 이미 존재하는지 확인한 후 생성
export const Paper =
  mongoose.models.Paper || mongoose.model<IPaper>('Paper', new mongoose.Schema({}));
