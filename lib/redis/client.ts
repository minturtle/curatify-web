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
        throw new Error('Redis 클라이언트가 초기화되지 않았습니다. initializeRedis()를 먼저 호출하세요.');
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

// 세션 관리 유틸리티
export const sessionUtils = {
    // 세션 저장
    async setSession(sessionId: string, data: any, ttl: number = 3600): Promise<void> {
        const client = getRedisClient();
        await client.setex(`session:${sessionId}`, ttl, JSON.stringify(data));
    },

    // 세션 가져오기
    async getSession(sessionId: string): Promise<any | null> {
        const client = getRedisClient();
        const data = await client.get(`session:${sessionId}`);
        return data ? JSON.parse(data) : null;
    },

    // 세션 삭제
    async deleteSession(sessionId: string): Promise<void> {
        const client = getRedisClient();
        await client.del(`session:${sessionId}`);
    },

    // 세션 갱신
    async refreshSession(sessionId: string, ttl: number = 3600): Promise<void> {
        const client = getRedisClient();
        await client.expire(`session:${sessionId}`, ttl);
    }
};

// AI 백그라운드 태스크 관리 유틸리티
export const taskUtils = {
    // 태스크 큐에 작업 추가
    async addTask(queueName: string, taskData: any, priority: number = 0): Promise<void> {
        const client = getRedisClient();
        const task = {
            id: Date.now().toString(),
            data: taskData,
            priority,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        await client.zadd(`queue:${queueName}`, priority, JSON.stringify(task));
    },

    // 태스크 가져오기
    async getNextTask(queueName: string): Promise<any | null> {
        const client = getRedisClient();
        const tasks = await client.zrange(`queue:${queueName}`, 0, 0, 'WITHSCORES');

        if (tasks.length === 0) return null;

        const task = JSON.parse(tasks[0]);
        await client.zrem(`queue:${queueName}`, tasks[0]);

        return task;
    },

    // 태스크 상태 업데이트
    async updateTaskStatus(taskId: string, status: string, result?: any): Promise<void> {
        const client = getRedisClient();
        const taskInfo = {
            status,
            result,
            updatedAt: new Date().toISOString()
        };

        await client.setex(`task:${taskId}`, 86400, JSON.stringify(taskInfo)); // 24시간 보관
    },

    // 태스크 결과 가져오기
    async getTaskResult(taskId: string): Promise<any | null> {
        const client = getRedisClient();
        const data = await client.get(`task:${taskId}`);
        return data ? JSON.parse(data) : null;
    }
};

// 캐시 관리 유틸리티
export const cacheUtils = {
    // 캐시 설정
    async set(key: string, value: any, ttl: number = 3600): Promise<void> {
        const client = getRedisClient();
        await client.setex(key, ttl, JSON.stringify(value));
    },

    // 캐시 가져오기
    async get(key: string): Promise<any | null> {
        const client = getRedisClient();
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    },

    // 캐시 삭제
    async delete(key: string): Promise<void> {
        const client = getRedisClient();
        await client.del(key);
    },

    // 패턴으로 캐시 삭제
    async deletePattern(pattern: string): Promise<void> {
        const client = getRedisClient();
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(...keys);
        }
    }
};
