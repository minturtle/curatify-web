/**
 * 사용자 관련 타입 정의
 * @author Minseok kim
 */

import { z } from 'zod';

export interface UserInterestsType {
  interestsId: string; // MongoDB ObjectId를 문자열로
  content: string;
}

export const UserInterestsSchema = z.object({
  userId: z.string().min(1, '사용자 ID는 필수입니다'), // MongoDB ObjectId를 문자열로
  content: z.string().max(300, '관심사는 300자 이하여야 합니다'),
});

// Server Action용 스키마 정의
export const AddInterestSchema = z.object({
  content: UserInterestsSchema.shape.content,
});

export const UpdateInterestSchema = z.object({
  interestsId: z.string().min(1, '유효한 관심사 ID를 입력해주세요'), // MongoDB ObjectId를 문자열로
  content: UserInterestsSchema.shape.content,
});

export const RemoveInterestSchema = z.object({
  interestsId: z.string().min(1, '유효한 관심사 ID를 입력해주세요'), // MongoDB ObjectId를 문자열로
});
