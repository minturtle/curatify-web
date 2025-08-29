import Redis from 'ioredis';
import { getRedisConfig } from '../database/config';

// Redis 클라이언트 인스턴스
let redisClient: Redis | null = null;

// Redis 연결 설정
const createRedisClient = (): Redis => {
  const config = getRedisConfig();

  return new Redis(config.url, {
    maxRetriesPerRequest: config.maxRetriesPerRequest,
    lazyConnect: config.lazyConnect,
    keepAlive: config.keepAlive,
    connectTimeout: config.connectTimeout,
    commandTimeout: config.commandTimeout,
    enableOfflineQueue: config.enableOfflineQueue,
  });
};

// Redis 클라이언트 초기화
export const initializeRedis = async (): Promise<Redis> => {
  if (!redisClient) {
    redisClient = createRedisClient();

    redisClient.on('connect', () => {
      console.log('Redis 클라이언트가 연결되었습니다.');
    });

    redisClient.on('error', (error) => {
      console.error('Redis 연결 오류:', error);
    });

    redisClient.on('close', () => {
      console.log('Redis 연결이 종료되었습니다.');
    });

    redisClient.on('reconnecting', () => {
      console.log('Redis 재연결 시도 중...');
    });
  }

  return redisClient;
};

// Redis 클라이언트 가져오기
export const getRedisClient = (): Redis => {
  if (!redisClient) {
    throw new Error(
      'Redis 클라이언트가 초기화되지 않았습니다. initializeRedis()를 먼저 호출하세요.'
    );
  }
  return redisClient;
};

// Redis 연결 종료
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

/**
 * Redis 채널에 JSON 객체를 발행합니다.
 * @param channel - 발행할 채널 이름
 * @param data - 발행할 JSON 데이터
 * @returns 발행된 구독자 수
 */
export const publishJson = async <T>(channel: string, data: T): Promise<number> => {
  const client = getRedisClient();
  const message = JSON.stringify(data);
  return await client.publish(channel, message);
};
