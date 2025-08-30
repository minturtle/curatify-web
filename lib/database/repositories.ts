/**
 * 데이터베이스 Repository 유틸리티
 * @author Minseok kim
 */

import { AppDataSource } from './ormconfig';
import { RSSUrl } from './entities/RSSUrl';
import { RSSFeed } from './entities/RSSFeed';
import { User } from './entities/User';
import { Paper } from './entities/Paper';
import { UserLibrary } from './entities/UserLibrary';
import { PaperContent } from './entities/PaperContent';

/**
 * RSSUrl repository를 가져오는 유틸 함수
 */
export function getRSSUrlRepository() {
  return AppDataSource.getRepository(RSSUrl);
}

/**
 * RSSFeed repository를 가져오는 유틸 함수
 */
export function getRSSFeedRepository() {
  return AppDataSource.getRepository(RSSFeed);
}

/**
 * User repository를 가져오는 유틸 함수
 */
export function getUserRepository() {
  return AppDataSource.getRepository(User);
}

/**
 * Paper repository를 가져오는 유틸 함수
 */
export function getPaperRepository() {
  return AppDataSource.getRepository(Paper);
}

export function getUserLibraryRepository() {
  return AppDataSource.getRepository(UserLibrary);
}

/**
 * PaperContent repository를 가져오는 유틸 함수
 */
export function getPaperContentRepository() {
  return AppDataSource.getRepository(PaperContent);
}
