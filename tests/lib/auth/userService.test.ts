import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  findUserInterests,
  addUserInterest,
  updateUserInterest,
  removeUserInterest,
} from '@/lib/auth/userService';
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

  describe('addUserInterest', () => {
    it('유효한 관심사를 추가해야 한다', async () => {
      // Mock session
      const mockSession = {
        userId: 123,
        email: 'test@example.com',
        role: 'not_approved' as const,
      };

      // Mock user
      const mockUser = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        isVerified: false,
      };

      // Mock saved interest
      const mockSavedInterest = {
        id: 1,
        userId: 123,
        content: '인공지능',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock repository
      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
        manager: {
          getRepository: vi.fn().mockReturnValue({
            create: vi.fn().mockReturnValue(mockSavedInterest),
            save: vi.fn().mockResolvedValue(mockSavedInterest),
          }),
        },
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      const result = await addUserInterest('인공지능');

      expect(getSession).toHaveBeenCalled();
      expect(getUserRepository).toHaveBeenCalled();
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 123 } });
      expect(mockRepository.manager.getRepository).toHaveBeenCalledWith('UserInterests');

      expect(result).toEqual({
        interestsId: 1,
        content: '인공지능',
      });
    });

    it('세션이 없으면 에러를 throw해야 한다', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(addUserInterest('인공지능')).rejects.toThrow('로그인이 필요합니다');
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

      await expect(addUserInterest('인공지능')).rejects.toThrow('사용자를 찾을 수 없습니다');
    });

    it('빈 관심사 내용에 대해 에러를 throw해야 한다', async () => {
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
      };

      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      await expect(addUserInterest('')).rejects.toThrow('사용자 관심사 추가에 실패했습니다');
    });

    it('너무 긴 관심사 내용에 대해 에러를 throw해야 한다', async () => {
      const mockSession = {
        userId: 123,
        email: 'test@example.com',
        role: 'not_approved' as const,
      };

      const longContent = 'a'.repeat(301); // 300자 초과

      vi.mocked(getSession).mockResolvedValue(mockSession);

      await expect(addUserInterest(longContent)).rejects.toThrow('관심사는 300자 이하여야 합니다');
    });
  });

  describe('updateUserInterest', () => {
    it('유효한 관심사를 수정해야 한다', async () => {
      // Mock session
      const mockSession = {
        userId: 123,
        email: 'test@example.com',
        role: 'approved' as const,
      };

      // Mock user
      const mockUser = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        isVerified: true,
      };

      // Mock existing interest
      const mockExistingInterest = {
        id: 1,
        userId: 123,
        content: '인공지능',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock updated interest
      const mockUpdatedInterest = {
        ...mockExistingInterest,
        content: '머신러닝',
      };

      // Mock repository
      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
        manager: {
          getRepository: vi.fn().mockReturnValue({
            findOne: vi.fn().mockResolvedValue(mockExistingInterest),
            save: vi.fn().mockResolvedValue(mockUpdatedInterest),
          }),
        },
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      const result = await updateUserInterest(1, '머신러닝');

      expect(getSession).toHaveBeenCalled();
      expect(getUserRepository).toHaveBeenCalled();
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 123 } });
      expect(mockRepository.manager.getRepository).toHaveBeenCalledWith('UserInterests');

      expect(result).toEqual({
        interestsId: 1,
        content: '머신러닝',
      });
    });

    it('세션이 없으면 에러를 throw해야 한다', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(updateUserInterest(1, '머신러닝')).rejects.toThrow('로그인이 필요합니다');
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

      await expect(updateUserInterest(1, '머신러닝')).rejects.toThrow('사용자를 찾을 수 없습니다');
    });

    it('관심사를 찾을 수 없으면 에러를 throw해야 한다', async () => {
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
      };

      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
        manager: {
          getRepository: vi.fn().mockReturnValue({
            findOne: vi.fn().mockResolvedValue(null),
          }),
        },
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      await expect(updateUserInterest(999, '머신러닝')).rejects.toThrow(
        '관심사를 찾을 수 없습니다'
      );
    });

    it('다른 사용자의 관심사를 수정하려고 하면 에러를 throw해야 한다', async () => {
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
      };

      // 다른 사용자의 관심사는 찾을 수 없어야 함 (userId가 다름)
      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
        manager: {
          getRepository: vi.fn().mockReturnValue({
            findOne: vi.fn().mockResolvedValue(null), // 다른 사용자의 관심사는 찾을 수 없음
            save: vi.fn(),
          }),
        },
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      await expect(updateUserInterest(1, '머신러닝')).rejects.toThrow('관심사를 찾을 수 없습니다');
    });

    it('빈 관심사 내용에 대해 에러를 throw해야 한다', async () => {
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
      };

      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      await expect(updateUserInterest(1, '')).rejects.toThrow('사용자 관심사 수정에 실패했습니다');
    });

    it('너무 긴 관심사 내용에 대해 에러를 throw해야 한다', async () => {
      const mockSession = {
        userId: 123,
        email: 'test@example.com',
        role: 'not_approved' as const,
      };

      const longContent = 'a'.repeat(301); // 300자 초과

      vi.mocked(getSession).mockResolvedValue(mockSession);

      await expect(updateUserInterest(1, longContent)).rejects.toThrow(
        '관심사는 300자 이하여야 합니다'
      );
    });
  });

  describe('removeUserInterest', () => {
    it('유효한 관심사를 제거해야 한다', async () => {
      // Mock session
      const mockSession = {
        userId: 123,
        email: 'test@example.com',
        role: 'not_approved' as const,
      };

      // Mock user
      const mockUser = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        isVerified: false,
      };

      // Mock existing interest
      const mockExistingInterest = {
        id: 1,
        userId: 123,
        content: '인공지능',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock repository
      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
        manager: {
          getRepository: vi.fn().mockReturnValue({
            findOne: vi.fn().mockResolvedValue(mockExistingInterest),
            remove: vi.fn().mockResolvedValue(undefined),
          }),
        },
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      await removeUserInterest(1);

      expect(getSession).toHaveBeenCalled();
      expect(getUserRepository).toHaveBeenCalled();
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 123 } });
      expect(mockRepository.manager.getRepository).toHaveBeenCalledWith('UserInterests');
      const mockInterestRepository = mockRepository.manager.getRepository('UserInterests');
      expect(mockInterestRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 123 },
      });
      expect(mockInterestRepository.remove).toHaveBeenCalledWith(mockExistingInterest);
    });

    it('세션이 없으면 에러를 throw해야 한다', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(removeUserInterest(1)).rejects.toThrow('로그인이 필요합니다');
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

      await expect(removeUserInterest(1)).rejects.toThrow('사용자를 찾을 수 없습니다');
    });

    it('관심사를 찾을 수 없으면 에러를 throw해야 한다', async () => {
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
      };

      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
        manager: {
          getRepository: vi.fn().mockReturnValue({
            findOne: vi.fn().mockResolvedValue(null),
          }),
        },
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      await expect(removeUserInterest(999)).rejects.toThrow('관심사를 찾을 수 없습니다');
    });

    it('다른 사용자의 관심사를 제거하려고 하면 에러를 throw해야 한다', async () => {
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
      };

      // 다른 사용자의 관심사는 찾을 수 없어야 함 (userId가 다름)
      const mockRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
        manager: {
          getRepository: vi.fn().mockReturnValue({
            findOne: vi.fn().mockResolvedValue(null), // 다른 사용자의 관심사는 찾을 수 없음
            remove: vi.fn(),
          }),
        },
      } as unknown as Repository<User>;

      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(getUserRepository).mockReturnValue(mockRepository);

      await expect(removeUserInterest(1)).rejects.toThrow('관심사를 찾을 수 없습니다');
    });
  });
});
