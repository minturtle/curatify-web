// MongoDB 스키마 모델들을 한 곳에서 export
export { User, type IUser } from './User';
export { Paper, type IPaper } from './Paper';
export { RSSUrl, type IRSSUrl } from './RSSUrl';
export { RSSFeed, type IRSSFeed } from './RSSFeed';
export { PaperContent, type IPaperContent } from './PaperContent';
export { PaperCategory, type IPaperCategory } from './PaperCategory';
export { UserLibrary, type IUserLibrary } from './UserLibrary';
export { UserInterests, type IUserInterests } from './UserInterests';

// 모든 모델을 배열로 export (초기화 시 사용)
export const models = [
  'User',
  'Paper',
  'RSSUrl',
  'RSSFeed',
  'PaperContent',
  'PaperCategory',
  'UserLibrary',
  'UserInterests',
] as const;
