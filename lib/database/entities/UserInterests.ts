import mongoose, { Document } from 'mongoose';

// UserInterests 인터페이스 정의
export interface IUserInterests extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// 모델이 이미 존재하는지 확인한 후 생성
export const UserInterests =
  mongoose.models.UserInterests ||
  mongoose.model<IUserInterests>('UserInterests', new mongoose.Schema({}));
