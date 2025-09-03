import mongoose, { Document, Schema } from 'mongoose';

// UserInterests 인터페이스 정의
export interface IUserInterests extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// UserInterests 스키마 정의
const UserInterestsSchema = new Schema<IUserInterests>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
    collection: 'user_interests',
  }
);

// 인덱스 설정
UserInterestsSchema.index({ userId: 1 });
UserInterestsSchema.index({ content: 1 });
UserInterestsSchema.index({ createdAt: -1 });

// 가상 필드 (관계 데이터)
UserInterestsSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// JSON 변환 시 가상 필드 포함
UserInterestsSchema.set('toJSON', { virtuals: true });
UserInterestsSchema.set('toObject', { virtuals: true });

// 모델 생성 및 내보내기
export const UserInterests = mongoose.model<IUserInterests>('UserInterests', UserInterestsSchema);
