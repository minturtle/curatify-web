import { DataSource } from 'typeorm';
import { getDatabaseConfig, validateConfig } from './config';
import { User } from './entities/User';
import { Paper } from './entities/Paper';
import { RSSUrl } from './entities/RSSUrl';
import { RSSFeed } from './entities/RSSFeed';
import { PaperContent } from './entities/PaperContent';
import { UserLibrary } from './entities/UserLibrary';

// 환경 설정 검증
validateConfig();

// 데이터베이스 설정 가져오기
const databaseConfig = getDatabaseConfig();

export const AppDataSource = new DataSource({
  ...databaseConfig,
  entities: [User, Paper, RSSUrl, RSSFeed, PaperContent, UserLibrary],
});

// 데이터베이스 연결 초기화
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log(
      `데이터베이스 연결이 성공적으로 설정되었습니다. (환경: ${process.env.NODE_ENV || 'development'})`
    );
  } catch (error) {
    console.error('데이터베이스 연결 중 오류가 발생했습니다:', error);
    throw error;
  }
};

// 데이터베이스 연결 종료
export const closeDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('데이터베이스 연결이 종료되었습니다.');
    }
  } catch (error) {
    console.error('데이터베이스 연결 종료 중 오류가 발생했습니다:', error);
  }
};
