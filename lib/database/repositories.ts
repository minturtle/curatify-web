/**
 * 데이터베이스 Repository 유틸리티
 * @author Minseok kim
 */

import { AppDataSource } from './ormconfig';
import { RSSUrl } from './entities/RSSUrl';
import { User } from './entities/User';

/**
 * RSSUrl repository를 가져오는 유틸 함수
 */
export function getRSSUrlRepository() {
  return AppDataSource.getRepository(RSSUrl);
}

/**
 * User repository를 가져오는 유틸 함수
 */
export function getUserRepository() {
  return AppDataSource.getRepository(User);
}
