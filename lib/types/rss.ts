/**
 * RSS 관련 타입 정의
 * @author Minseok kim
 */

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
