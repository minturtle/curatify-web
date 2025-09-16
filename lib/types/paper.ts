/**
 * 논문 관련 타입 정의
 * @author Minseok kim
 */

import { z } from 'zod';

export interface Paper {
  id: string; // MongoDB ObjectId를 문자열로
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
 * ArXiv ID 형식 검증을 위한 정규식
 * 형식: YYMM.NNNNN 또는 YYMM.NNNNNvN
 * 예: 2301.00001, 2301.00001v1
 */
const ARXIV_ID_REGEX = /^\d{4}\.\d{5}(v\d+)?$/;

/**
 * 논문 심층 분석 등록을 위한 Zod 스키마
 */
export const RegisterPaperSchema = z.object({
  paperId: z
    .string()
    .min(1, 'ArXiv ID는 필수입니다.')
    .regex(ARXIV_ID_REGEX, '올바른 ArXiv ID 형식이 아닙니다. (예: 2301.00001 또는 2301.00001v1)'),
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

export interface UserLibrary {
  paperContentId: string; // MongoDB ObjectId를 문자열로
  title: string;
  authors: string[];
  createdAt: Date;
}

export interface PaperDetail {
  paperContentId: string; // MongoDB ObjectId를 문자열로
  title: string;
  authors: string[];
  content: PaperContentBlock[];
  createdAt: Date;
  publishedAt?: Date; // optional로 변경
  url: string;
}

export interface PaperContentBlock {
  id: string; // MongoDB ObjectId를 문자열로
  title: string;
  content: string;
  order: number;
}
