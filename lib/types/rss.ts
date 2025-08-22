/**
 * RSS 관련 타입 정의
 * @author Minseok kim
 */

export interface RSSUrl {
  id: string;
  url: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RSSFeed {
  id: string;
  feedId: string;
  title: string;
  description?: string;
  link: string;
  pubDate: Date;
  author?: string;
  category?: string;
  createdAt: Date;
}

export interface RSSUrlFormData {
  url: string;
}
