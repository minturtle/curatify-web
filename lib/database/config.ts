import { DataSourceOptions } from 'typeorm';

// 환경별 데이터베이스 설정
export const getDatabaseConfig = (): DataSourceOptions => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // 개발환경 (Oracle 19c)
    return {
      type: 'oracle',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '1521'),
      username: process.env.DB_USERNAME || 'system',
      password: process.env.DB_PASSWORD || 'rootpassword',
      sid: process.env.DB_SID,
      serviceName: process.env.DB_SERVICE_NAME || 'ORCLCDB',
      schema: process.env.DB_SCHEMA || 'SYSTEM',
      synchronize: false, // 자동 동기화 비활성화 (Oracle에서는 특히 중요)
      logging: true,
      entities: ['lib/database/entities/*.ts'],
      extra: {
        poolSize: 10,
        queueTimeout: 60000,
        connectTimeout: 60000,
        enableArithAbort: true,
        // Oracle 한글 지원을 위한 NLS 설정
        options: {
          'NLS_LANG': 'AMERICAN_AMERICA.AL32UTF8',
          'NLS_CHARACTERSET': 'AL32UTF8',
        },
      },
    };
  } else {
    // 운영환경 (Oracle with DSN)
    return {
      type: 'oracle',
      connectString: process.env.DB_DSN || process.env.DB_CONNECT_STRING,
      username: process.env.DB_USERNAME || 'system',
      password: process.env.DB_PASSWORD || '',
      synchronize: false, // 운영환경에서는 자동 동기화 비활성화
      logging: false,
      entities: ['lib/database/entities/*.ts'],
      extra: {
        poolSize: 10,
        queueTimeout: 60000,
        connectTimeout: 60000,
        // Oracle 한글 지원을 위한 NLS 설정
        options: {
          'NLS_LANG': 'AMERICAN_AMERICA.AL32UTF8',
          'NLS_CHARACTERSET': 'AL32UTF8',
        },
      },
    };
  }
};

// Redis 설정
export const getRedisConfig = () => {
  return {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    keepAlive: 30000,
    connectTimeout: 10000,
    commandTimeout: 5000,
    enableOfflineQueue: false,
  };
};

// 환경별 설정 검증
export const validateConfig = () => {
  const currentEnv = process.env.NODE_ENV || 'development';

  // 테스트 환경에서는 환경 변수 검증을 건너뜀
  if (currentEnv === 'test') {
    return;
  }

  const requiredEnvVars = {
    development: ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD'],
    production: ['DB_DSN', 'DB_USERNAME', 'DB_PASSWORD', 'REDIS_URL'],
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
