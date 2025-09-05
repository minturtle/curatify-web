import { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';

// MongoDB 연결 옵션 타입
export interface MongoDBConfig {
  uri: string;
  options: ConnectOptions;
}

// Redis 설정 타입
export interface RedisConfig {
  url: string;
  maxRetriesPerRequest: number;
  lazyConnect: boolean;
  keepAlive: number;
  connectTimeout: number;
  commandTimeout: number;
  enableOfflineQueue: boolean;
  username?: string;
  password?: string;
}

// 환경별 데이터베이스 설정
export const getDatabaseConfig = (): MongoDBConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // 개발환경 (MongoDB)
    return {
      uri: process.env.MONGODB_URI!,
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        autoIndex: true,
        autoCreate: true,
      },
    };
  } else {
    // 운영환경 (MongoDB)
    return {
      uri: process.env.MONGODB_URI!,
      options: { },
    };
  }
};

// Redis 설정
export const getRedisConfig = (): RedisConfig => {
  const config: RedisConfig = {
    url: process.env.REDIS_URL!,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    keepAlive: 30000,
    connectTimeout: 10000,
    commandTimeout: 5000,
    enableOfflineQueue: false,
  };

  // Redis 인증 정보가 있는 경우 추가
  if (process.env.REDIS_USERNAME) {
    config.username = process.env.REDIS_USERNAME;
  }

  if (process.env.REDIS_PASSWORD) {
    config.password = process.env.REDIS_PASSWORD;
  }

  return config;
};

// MongoDB 연결 초기화
export const initializeDatabase = async () => {
  try {
    const config = getDatabaseConfig();
    await mongoose.connect(config.uri, config.options);
    console.log(
      `MongoDB 연결이 성공적으로 설정되었습니다. (환경: ${process.env.NODE_ENV || 'development'})`
    );
  } catch (error) {
    console.error('MongoDB 연결 중 오류가 발생했습니다:', error);
    throw error;
  }
};

// MongoDB 연결 종료
export const closeDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('MongoDB 연결이 종료되었습니다.');
    }
  } catch (error) {
    console.error('MongoDB 연결 종료 중 오류가 발생했습니다:', error);
  }
};

// MongoDB 연결 상태 확인
export const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    readyState: mongoose.connection.readyState,
    status: states[mongoose.connection.readyState as keyof typeof states],
    isConnected: mongoose.connection.readyState === 1,
  };
};

// MongoDB 연결 인스턴스 내보내기 (기존 코드와의 호환성을 위해)
export const AppDataSource = {
  isInitialized: mongoose.connection.readyState === 1,
  initialize: initializeDatabase,
  destroy: closeDatabase,
};

// 환경별 설정 검증
export const validateConfig = () => {
  const currentEnv = process.env.NODE_ENV || 'development';

  // 테스트 환경에서는 환경 변수 검증을 건너뜀
  if (currentEnv === 'test') {
    return;
  }

  const requiredEnvVars = {
    development: ['MONGODB_URI'],
    production: ['MONGODB_URI', 'REDIS_URL'],
  };

  const required = requiredEnvVars[currentEnv as keyof typeof requiredEnvVars];

  // 지원되지 않는 환경인 경우 검증 건너뜀
  if (!required) {
    console.warn(`환경 변수 검증이 지원되지 않는 환경입니다: ${currentEnv}`);
    return;
  }

  const missing = required.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(
      `필수 환경 변수가 누락되었습니다: ${missing.join(', ')}\n` + `현재 환경: ${currentEnv}`
    );
  }
};
