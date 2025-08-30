/**
 * 사용자 관련 타입 정의
 * @author Minseok kim
 */

import { z } from 'zod';

export interface UserInterestsType {
  interestsId: number;
  content: string;
}

export const UserInterestsSchema = z.object({
  userId: z.number(),
  content: z.string().max(300, '관심사는 300자 이하여야 합니다'),
});
