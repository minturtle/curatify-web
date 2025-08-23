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
  feedId: string;
  title: string;
  description?: string;
  link: string;
  pubDate: Date;
  author?: string;
  createdAt: Date;
}

export interface RSSUrlFormData {
  url: string;
  type: RSSType;
}

// RSS URL 등록을 위한 Zod 스키마
export const RSSUrlSchema = z.object({
  url: z.string().url('유효한 URL을 입력해주세요.'),
  type: z.enum(['rss', 'youtube'] as const).refine((val) => val !== undefined, {
    message: 'RSS 타입을 선택해주세요.',
  }),
});

// Zod 스키마에서 추출한 타입
export type RSSUrlSchemaType = z.infer<typeof RSSUrlSchema>;

// Server Action 리턴 타입 정의
export interface RSSUrlActionState {
  success: boolean;
  error?: string;
}

// RSS URL 등록 Server Action 리턴 타입
export type AddRSSUrlActionResult = RSSUrlActionState | null;
