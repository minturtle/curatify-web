import mongoose, { Document, Schema } from 'mongoose';

// UserInterests 인터페이스 정의
export interface IUserInterests extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// 최소한의 스키마 정의 (인덱스나 제약조건 없이)
const UserInterestsSchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    content: String,
  },
  {
    timestamps: true,
    collection: 'user_interests',
  }
);

// 모델이 이미 존재하는지 확인한 후 생성
export const UserInterests =
  mongoose.models.UserInterests ||
  mongoose.model<IUserInterests>('UserInterests', UserInterestsSchema);
