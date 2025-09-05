import mongoose from 'mongoose';
import { initializeDatabase, closeDatabase } from './config';

let isConnected = false;

/**
 * 데이터베이스 연결을 확인하고 필요시 초기화합니다.
 *
 * @returns {Promise<void>}
 * @description 데이터베이스가 초기화되지 않은 경우 자동으로 초기화합니다.
 *              이미 초기화된 경우 아무 작업도 수행하지 않습니다.
 *
 * @example
 * ```typescript
 * import { ensureDatabaseConnection } from '@/lib/database/connection'
 *
 * export async function someServiceFunction() {
 *   await ensureDatabaseConnection()
 *   // 데이터베이스 작업 수행
 * }
 * ```
 */
export async function ensureDatabaseConnection(): Promise<void> {
  if (!isConnected) {
    try {
      await initializeDatabase();
      isConnected = true;
    } catch (error) {
      console.error('MongoDB 초기화 중 오류 발생:', error);
      throw new Error('MongoDB 연결에 실패했습니다');
    }
  }
}

/**
 * 데이터베이스 연결 상태를 확인합니다.
 *
 * @returns {boolean} 데이터베이스가 초기화되었는지 여부
 * @description 데이터베이스 연결 상태만 확인하고 초기화는 수행하지 않습니다.
 *
 * @example
 * ```typescript
 * import { isDatabaseConnected } from '@/lib/database/connection'
 *
 * if (isDatabaseConnected()) {
 *   console.log('데이터베이스가 연결되어 있습니다')
 * }
 * ```
 */
export function isDatabaseConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

/**
 * 데이터베이스 연결을 강제로 초기화합니다.
 *
 * @returns {Promise<void>}
 * @description 이미 초기화된 경우에도 다시 초기화를 시도합니다.
 *              주의: 이 함수는 기존 연결을 끊고 새로 연결합니다.
 *
 * @example
 * ```typescript
 * import { forceDatabaseConnection } from '@/lib/database/connection'
 *
 * // 연결 문제 해결을 위해 강제 재연결
 * await forceDatabaseConnection()
 * ```
 */
export async function forceDatabaseConnection(): Promise<void> {
  try {
    // 기존 연결이 있다면 종료
    if (isConnected) {
      await closeDatabase();
      isConnected = false;
    }

    // 새로 초기화
    await initializeDatabase();
    isConnected = true;
    console.log('MongoDB 연결이 강제로 초기화되었습니다.');
  } catch (error) {
    console.error('MongoDB 강제 초기화 중 오류 발생:', error);
    throw new Error('MongoDB 연결에 실패했습니다');
  }
}

/**
 * 데이터베이스 연결을 종료합니다.
 *
 * @returns {Promise<void>}
 * @description 애플리케이션 종료 시 호출하여 연결을 정리합니다.
 */
export async function closeDatabaseConnection(): Promise<void> {
  try {
    if (isConnected) {
      await closeDatabase();
      isConnected = false;
      console.log('MongoDB 연결이 종료되었습니다.');
    }
  } catch (error) {
    console.error('MongoDB 연결 종료 중 오류 발생:', error);
  }
}

// 연결 이벤트 리스너
mongoose.connection.on('connected', () => {
  console.log('MongoDB에 연결되었습니다.');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 오류:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB 연결이 끊어졌습니다.');
  isConnected = false;
});

// 프로세스 종료 시 연결 정리
process.on('SIGINT', async () => {
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabaseConnection();
  process.exit(0);
});
