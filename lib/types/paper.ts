/**
 * 논문 관련 타입 정의
 * @author Minseok kim
 */

import { z } from 'zod';

export interface Paper {
  id: number;
  title: string;
  summary: string;
  authors: string[];
  link: string;
  lastUpdate: string;
  categories: string[];
}

export interface PaperListProps {
  papers: Paper[];
}

/**
 * 논문 심층 분석 등록을 위한 Zod 스키마
 */
export const RegisterPaperSchema = z.object({
  paperId: z.coerce.number().int().positive('논문 ID는 양의 정수여야 합니다.'),
});

export type RegisterPaperInput = z.infer<typeof RegisterPaperSchema>;

/**
 * 논문 심층 분석 등록 결과 타입
 */
export interface RegisterPaperActionResult {
  success: boolean;
  message?: string;
  error?: string;
}
