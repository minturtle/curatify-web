import mongoose, { Document, Schema } from 'mongoose';

// UserLibrary 인터페이스 정의
export interface IUserLibrary extends Document {
  userId: mongoose.Types.ObjectId;
  paperId: mongoose.Types.ObjectId;
  createdAt: Date;
}

// UserLibrary 스키마 정의
const UserLibrarySchema = new Schema<IUserLibrary>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paperId: {
      type: Schema.Types.ObjectId,
      ref: 'Paper',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // createdAt만 자동 생성
    collection: 'user_library',
  }
);

// 인덱스 설정
UserLibrarySchema.index({ userId: 1 });
UserLibrarySchema.index({ paperId: 1 });
UserLibrarySchema.index({ createdAt: -1 });

// 복합 인덱스 (사용자별 논문 중복 방지)
UserLibrarySchema.index({ userId: 1, paperId: 1 }, { unique: true });

// 가상 필드 (관계 데이터)
UserLibrarySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

UserLibrarySchema.virtual('paper', {
  ref: 'Paper',
  localField: 'paperId',
  foreignField: '_id',
  justOne: true,
});

// JSON 변환 시 가상 필드 포함
UserLibrarySchema.set('toJSON', { virtuals: true });
UserLibrarySchema.set('toObject', { virtuals: true });

// 모델 생성 및 내보내기
export const UserLibrary = mongoose.model<IUserLibrary>('UserLibrary', UserLibrarySchema);
