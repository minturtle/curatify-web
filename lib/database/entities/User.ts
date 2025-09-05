import mongoose, { Document, Schema } from 'mongoose';

// User 인터페이스 정의
export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 최소한의 스키마 정의 (인덱스나 제약조건 없이)
const UserSchema = new Schema(
  {
    email: String,
    password: String,
    name: String,
    isVerified: Boolean,
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// 모델이 이미 존재하는지 확인한 후 생성
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
