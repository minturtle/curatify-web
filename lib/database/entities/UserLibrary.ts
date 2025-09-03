import mongoose, { Document, Schema } from 'mongoose';

// UserLibrary 인터페이스 정의
export interface IUserLibrary extends Document {
  userId: mongoose.Types.ObjectId;
  paperId: mongoose.Types.ObjectId;
  createdAt: Date;
}

// 최소한의 스키마 정의 (인덱스나 제약조건 없이)
const UserLibrarySchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    paperId: Schema.Types.ObjectId,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'user_library',
  }
);

// 모델이 이미 존재하는지 확인한 후 생성
export const UserLibrary =
  mongoose.models.UserLibrary || mongoose.model<IUserLibrary>('UserLibrary', UserLibrarySchema);
