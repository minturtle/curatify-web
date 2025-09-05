import 'reflect-metadata';
import { initializeDatabase, closeDatabase } from './database/config';
import { initializeRedis, closeRedis } from './redis/client';

let isInitialized = false;

export const initializeApp = async () => {
  if (isInitialized) {
    console.log('애플리케이션이 이미 초기화되었습니다.');
    return;
  }

  try {
    console.log('애플리케이션 초기화를 시작합니다...');
    console.log(`환경: ${process.env.NODE_ENV || 'development'}`);

    // 데이터베이스 초기화
    await initializeDatabase();

    // Redis 초기화
    await initializeRedis();

    isInitialized = true;
    console.log('애플리케이션 초기화가 완료되었습니다.');
  } catch (error) {
    console.error('애플리케이션 초기화 중 오류가 발생했습니다:', error);
    throw error;
  }
};

export const closeApp = async () => {
  try {
    console.log('애플리케이션 종료를 시작합니다...');

    // 데이터베이스 연결 종료
    await closeDatabase();

    // Redis 연결 종료
    await closeRedis();

    isInitialized = false;
    console.log('애플리케이션 종료가 완료되었습니다.');
  } catch (error) {
    console.error('애플리케이션 종료 중 오류가 발생했습니다:', error);
  }
};

// 프로세스 종료 시 정리 작업
process.on('SIGINT', async () => {
  console.log('\nSIGINT 신호를 받았습니다. 애플리케이션을 종료합니다...');
  await closeApp();
  await closeRedis();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nSIGTERM 신호를 받았습니다. 애플리케이션을 종료합니다...');
  await closeApp();
  await closeRedis();
  process.exit(0);
});

// 예상치 못한 오류 처리
process.on('uncaughtException', async (error) => {
  console.error('예상치 못한 오류가 발생했습니다:', error);
  await closeApp();
  process.exit(1);
});

process.on('unhandledRejection', async (reason) => {
  console.error('처리되지 않은 Promise 거부가 발생했습니다:', reason);
  await closeApp();
  process.exit(1);
});
