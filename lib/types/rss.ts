/**
 * RSS 관련 타입 정의
 * @author Minseok kim
 */

import { z } from 'zod';

export type RSSType = 'rss' | 'youtube';

export interface RSSUrl {
  id: string;
  url: string;
  type: RSSType;
}

export interface RSSFeed {
  id: string;
  title: string;
  summary?: string;
  writedAt: Date;
  originalUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  rssUrl?: RSSUrl;
}

export interface RSSUrlFormData {
  url: string;
  type: RSSType;
}

export interface PaginatedRSSFeeds {
  items: RSSFeed[];
  totalPages: number;
  totalItems: number;
}

// RSS URL 등록을 위한 Zod 스키마
export const RSSUrlSchema = z.object({
  url: z.string().url('유효한 URL을 입력해주세요.'),
  type: z.enum(['rss', 'youtube'] as const).refine((val) => val !== undefined, {
    message: 'RSS 타입을 선택해주세요.',
  }),
});

// RSS URL 삭제를 위한 Zod 스키마
export const RSSUrlDeleteSchema = z.object({
  id: z.string().min(1, 'RSS URL ID가 필요합니다.'),
});

// Zod 스키마에서 추출한 타입
export type RSSUrlSchemaType = z.infer<typeof RSSUrlSchema>;
export type RSSUrlDeleteSchemaType = z.infer<typeof RSSUrlDeleteSchema>;

// Server Action 리턴 타입 정의
export interface RSSUrlActionState {
  success: boolean;
  error?: string;
}

// RSS URL 등록 Server Action 리턴 타입
export type AddRSSUrlActionResult = RSSUrlActionState | null;

// RSS URL 삭제 Server Action 리턴 타입
export type DeleteRSSUrlActionResult = RSSUrlActionState;
