import mongoose, { Schema, Document } from 'mongoose';

/**
 * 사용자 논문 초록 매핑 인터페이스
 */
export interface IUserPaperAbstracts extends Document {
  /** 사용자 ID */
  user_id: mongoose.Types.ObjectId;
  /** 논문 ID */
  paper_id: mongoose.Types.ObjectId;
  /** 생성일 */
  createdAt: Date;
  /** 수정일 */
  updatedAt: Date;
}

/**
 * 사용자 논문 초록 매핑 스키마
 */
const UserPaperAbstractsSchema = new Schema<IUserPaperAbstracts>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paper_id: {
      type: Schema.Types.ObjectId,
      ref: 'Paper',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'user_paper_abstracts',
  }
);

// 복합 인덱스 (user_id, paper_id)
UserPaperAbstractsSchema.index({ user_id: 1, paper_id: 1 }, { unique: true });

export const UserPaperAbstracts = mongoose.models.UserPaperAbstracts || 
  mongoose.model<IUserPaperAbstracts>('UserPaperAbstracts', UserPaperAbstractsSchema);
