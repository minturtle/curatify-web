import mongoose, { Document } from 'mongoose';

// User 인터페이스 정의
export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 모델이 이미 존재하는지 확인한 후 생성
export const User = mongoose.models.User || mongoose.model<IUser>('User', new mongoose.Schema({}));
