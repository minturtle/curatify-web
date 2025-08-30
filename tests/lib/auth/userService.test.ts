import { describe, it, expect, beforeEach, vi } from 'vitest';
import { findUserInterests } from '@/lib/auth/userService';
import { getSession } from '@/lib/auth/session';
import { getUserRepository } from '@/lib/database/repositories';
import { User } from '@/lib/database/entities/User';
import { Repository } from 'typeorm';

// Mock dependencies
vi.mock('@/lib/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/database/connection', () => ({
  ensureDatabaseConnection: vi.fn(),
}));

vi.mock('@/lib/database/repositories', () => ({
  getUserRepository: vi.fn(),
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findUserInterests', () => {
    it('유효한 세션으로 사용자 관심사를 조회해야 한다', async () => {
      // Mock session
      const mockSession = {
        userId: 123,
        email: 'test@example.com',
        role: 'not_approved' as const,
      };

      // Mock user with interests
      const mockUser = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        isVerified: false,
        interests: Promise.resolve([
          {
            id: 1,
            userId: 123,
            content: '인공지능',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            userId: 123,
            content: '머신러닝',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      };

      // Mock repository
      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      const result = await findUserInterests();

      expect(getSession).toHaveBeenCalled();
      expect(getUserRepository).toHaveBeenCalled();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 123 },
        relations: ['interests'],
      });

      expect(result).toEqual([
        {
          interestsId: 1,
          content: '인공지능',
        },
        {
          interestsId: 2,
          content: '머신러닝',
        },
      ]);
    });

    it('세션이 없으면 에러를 throw해야 한다', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(findUserInterests()).rejects.toThrow('로그인이 필요합니다');
    });

    it('사용자를 찾을 수 없으면 에러를 throw해야 한다', async () => {
      const mockSession = {
        userId: 123,
        email: 'test@example.com',
        role: 'not_approved' as const,
      };

      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(null),
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      await expect(findUserInterests()).rejects.toThrow('사용자를 찾을 수 없습니다');
    });

    it('관심사가 없는 사용자의 경우 빈 배열을 반환해야 한다', async () => {
      const mockSession = {
        userId: 123,
        email: 'test@example.com',
        role: 'not_approved' as const,
      };

      const mockUser = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        isVerified: false,
        interests: Promise.resolve([]),
      };

      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      const result = await findUserInterests();

      expect(result).toEqual([]);
    });
  });
});
