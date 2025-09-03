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

// User 스키마 정의
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
    collection: 'users',
  }
);

// 인덱스 설정
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

// 가상 필드 (관계 데이터)
UserSchema.virtual('rssUrls', {
  ref: 'RSSUrl',
  localField: '_id',
  foreignField: 'userId',
});

UserSchema.virtual('userLibraries', {
  ref: 'UserLibrary',
  localField: '_id',
  foreignField: 'userId',
});

UserSchema.virtual('interests', {
  ref: 'UserInterests',
  localField: '_id',
  foreignField: 'userId',
});

// JSON 변환 시 가상 필드 포함
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// 모델 생성 및 내보내기
export const User = mongoose.model<IUser>('User', UserSchema);
