import mongoose, { Document } from 'mongoose';

// UserLibrary 인터페이스 정의
export interface IUserLibrary extends Document {
  userId: mongoose.Types.ObjectId;
  paperId: mongoose.Types.ObjectId;
  createdAt: Date;
}

// 모델이 이미 존재하는지 확인한 후 생성
export const UserLibrary =
  mongoose.models.UserLibrary ||
  mongoose.model<IUserLibrary>('UserLibrary', new mongoose.Schema({}));
