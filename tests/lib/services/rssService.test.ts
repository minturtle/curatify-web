/**
 * RSS 서비스 테스트
 * @author Minseok kim
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { addRSSUrl, getRSSFeeds, getRSSUrls, deleteRSSUrl } from '@/lib/rss/rssService';
import { RSSUrlFormData } from '@/lib/types/rss';
import { Repository } from 'typeorm';
import { User } from '@/lib/database/entities/User';
import { RSSUrl as RSSUrlEntity } from '@/lib/database/entities/RSSUrl';
import { RSSFeed as RSSFeedEntity } from '@/lib/database/entities/RSSFeed';

// Mock 모듈들
vi.mock('@/lib/database/connection', () => ({
  ensureDatabaseConnection: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/database/repositories', () => ({
  getRSSUrlRepository: vi.fn(),
  getRSSFeedRepository: vi.fn(),
  getUserRepository: vi.fn(),
}));

vi.mock('@/lib/redis/client', () => ({
  publishJson: vi.fn().mockResolvedValue(1),
}));

vi.mock('@/lib/auth/session', () => ({
  getSession: vi.fn(),
}));

describe('RSS Service', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRSSUrl = {
    id: 1,
    url: 'https://example.com/rss',
    type: 'normal' as const,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    rssFeeds: [],
  };

  const mockRSSFeeds = [
    {
      id: 1,
      title: 'AI 기술의 새로운 발전: GPT-5 출시 예정',
      summary:
        'OpenAI가 GPT-5 출시를 앞두고 있으며, 이번 버전에서는 더욱 향상된 자연어 처리 능력을 제공할 예정입니다.',
      writedAt: new Date('2024-01-15T10:00:00Z'),
      originalUrl: 'https://techcrunch.com/2024/01/15/ai-gpt5-release',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      rssUrl: mockRSSUrl,
    },
    {
      id: 2,
      title: '메타버스 플랫폼의 미래 전망',
      summary: '메타버스 기술이 어떻게 우리의 일상생활을 변화시킬지에 대한 심층 분석을 제공합니다.',
      writedAt: new Date('2024-01-14T15:30:00Z'),
      originalUrl: 'https://techcrunch.com/2024/01-14/metaverse-future',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
      rssUrl: mockRSSUrl,
    },
    {
      id: 3,
      title: '새로운 스마트폰 기술 트렌드',
      summary: '2024년 스마트폰 시장의 주요 기술 트렌드와 향후 발전 방향을 살펴봅니다.',
      writedAt: new Date('2024-01-13T09:15:00Z'),
      originalUrl: 'https://www.theverge.com/2024/01/13/smartphone-trends',
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13'),
      rssUrl: mockRSSUrl,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('addRSSUrl', () => {
    it('유효한 RSS URL을 등록할 때 성공한다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSUrlRepository, getUserRepository } = await import(
        '@/lib/database/repositories'
      );
      const { publishJson } = await import('@/lib/redis/client');

      // Mock 설정
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockUserRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
      };

      const mockRSSUrlRepository = {
        create: vi.fn().mockReturnValue(mockRSSUrl),
        save: vi.fn().mockResolvedValue(mockRSSUrl),
        query: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getUserRepository).mockReturnValue(
        mockUserRepository as unknown as Repository<User>
      );
      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );

      const formData: RSSUrlFormData = {
        url: 'https://example.com/rss',
        type: 'rss',
      };

      const result = await addRSSUrl(formData);

      expect(result).toEqual(mockRSSUrl);
      expect(mockRSSUrlRepository.save).toHaveBeenCalled();
      expect(publishJson).toHaveBeenCalledWith('rss:update_feeds', {
        url: formData.url,
        type: formData.type,
        userId: 1,
        rssUrlId: mockRSSUrl.id,
      });
    });

    it('유효한 YouTube URL을 등록할 때 성공한다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSUrlRepository, getUserRepository } = await import(
        '@/lib/database/repositories'
      );
      const { publishJson } = await import('@/lib/redis/client');

      // Mock 설정
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockUserRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
      };

      const mockRSSUrlRepository = {
        create: vi.fn().mockReturnValue({ ...mockRSSUrl, type: 'youtube' }),
        save: vi.fn().mockResolvedValue({ ...mockRSSUrl, type: 'youtube' }),
        query: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getUserRepository).mockReturnValue(
        mockUserRepository as unknown as Repository<User>
      );
      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );

      const formData: RSSUrlFormData = {
        url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw',
        type: 'youtube',
      };

      const result = await addRSSUrl(formData);

      expect(result).toBeDefined();
      expect(publishJson).toHaveBeenCalledWith('rss:update_feeds', {
        url: formData.url,
        type: formData.type,
        userId: 1,
        rssUrlId: mockRSSUrl.id,
      });
    });

    it('로그인하지 않은 사용자가 RSS URL을 등록하면 에러를 던진다', async () => {
      const { getSession } = await import('@/lib/auth/session');

      // Mock 설정 - 세션이 없음
      vi.mocked(getSession).mockResolvedValue(null);

      const formData: RSSUrlFormData = {
        url: 'https://example.com/rss',
        type: 'rss',
      };

      await expect(addRSSUrl(formData)).rejects.toThrow('로그인이 필요합니다.');
    });

    it('사용자를 찾을 수 없으면 에러를 던진다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getUserRepository } = await import('@/lib/database/repositories');

      // Mock 설정
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockUserRepository = {
        findOne: vi.fn().mockResolvedValue(null), // 사용자를 찾을 수 없음
      };

      vi.mocked(getUserRepository).mockReturnValue(
        mockUserRepository as unknown as Repository<User>
      );

      const formData: RSSUrlFormData = {
        url: 'https://example.com/rss',
        type: 'rss',
      };

      await expect(addRSSUrl(formData)).rejects.toThrow('RSS URL 등록에 실패했습니다.');
    });

    it('유효하지 않은 URL을 등록하면 에러를 던진다', async () => {
      const formData: RSSUrlFormData = {
        url: 'invalid-url',
        type: 'rss',
      };

      await expect(addRSSUrl(formData)).rejects.toThrow('유효하지 않은 URL입니다.');
    });

    it('빈 URL을 등록하면 에러를 던진다', async () => {
      const formData: RSSUrlFormData = {
        url: '',
        type: 'rss',
      };

      await expect(addRSSUrl(formData)).rejects.toThrow('유효하지 않은 URL입니다.');
    });

    it('유효하지 않은 타입을 등록하면 에러를 던진다', async () => {
      const formData = {
        url: 'https://example.com/rss',
        type: 'invalid-type',
      } as unknown as RSSUrlFormData;

      await expect(addRSSUrl(formData)).rejects.toThrow('유효하지 않은 RSS 타입입니다.');
    });

    it('YouTube 타입이지만 YouTube URL이 아니면 에러를 던진다', async () => {
      const formData: RSSUrlFormData = {
        url: 'https://example.com/rss',
        type: 'youtube',
      };

      await expect(addRSSUrl(formData)).rejects.toThrow('유효하지 않은 YouTube URL입니다.');
    });

    it('빈 타입을 등록하면 에러를 던진다', async () => {
      const formData = {
        url: 'https://example.com/rss',
        type: '',
      } as unknown as RSSUrlFormData;

      await expect(addRSSUrl(formData)).rejects.toThrow('유효하지 않은 RSS 타입입니다.');
    });

    it('데이터베이스 저장 실패 시 에러를 던진다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSUrlRepository, getUserRepository } = await import(
        '@/lib/database/repositories'
      );

      // Mock 설정
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockUserRepository = {
        findOne: vi.fn().mockResolvedValue(mockUser),
      };

      const mockRSSUrlRepository = {
        create: vi.fn().mockReturnValue(mockRSSUrl),
        save: vi.fn().mockRejectedValue(new Error('Database error')),
        query: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getUserRepository).mockReturnValue(
        mockUserRepository as unknown as Repository<User>
      );
      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );

      const formData: RSSUrlFormData = {
        url: 'https://example.com/rss',
        type: 'rss',
      };

      await expect(addRSSUrl(formData)).rejects.toThrow('RSS URL 등록에 실패했습니다.');
    });
  });

  describe('getRSSFeeds', () => {
    it('현재 사용자의 RSS 피드 목록을 페이지네이션과 함께 반환한다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSFeedRepository, getRSSUrlRepository } = await import(
        '@/lib/database/repositories'
      );

      // Mock 설정 - 세션
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockRSSUrlRepository = {
        find: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]), // 사용자의 RSS URL ID들
      };

      const mockRSSFeedRepository = {
        find: vi.fn().mockResolvedValue(mockRSSFeeds),
        count: vi.fn().mockResolvedValue(mockRSSFeeds.length),
      };

      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );
      vi.mocked(getRSSFeedRepository).mockReturnValue(
        mockRSSFeedRepository as unknown as Repository<RSSFeedEntity>
      );

      const result = await getRSSFeeds(1, 5);

      expect(result).toBeDefined();
      expect(result.items).toBeInstanceOf(Array);
      expect(result.totalPages).toBeGreaterThan(0);
      expect(result.totalItems).toBeGreaterThan(0);
      expect(mockRSSUrlRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        select: ['id'],
        withDeleted: true,
      });
      expect(mockRSSFeedRepository.find).toHaveBeenCalled();
      expect(mockRSSFeedRepository.count).toHaveBeenCalled();
    });

    it('페이지 번호에 따라 올바른 아이템을 반환한다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSFeedRepository, getRSSUrlRepository } = await import(
        '@/lib/database/repositories'
      );

      // Mock 설정 - 세션
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockRSSUrlRepository = {
        find: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
      };

      const mockRSSFeedRepository = {
        find: vi
          .fn()
          .mockResolvedValueOnce(mockRSSFeeds.slice(0, 3))
          .mockResolvedValueOnce(mockRSSFeeds.slice(3, 6)),
        count: vi.fn().mockResolvedValue(mockRSSFeeds.length),
      };

      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );
      vi.mocked(getRSSFeedRepository).mockReturnValue(
        mockRSSFeedRepository as unknown as Repository<RSSFeedEntity>
      );

      const page1 = await getRSSFeeds(1, 3);
      const page2 = await getRSSFeeds(2, 3);

      expect(page1.items.length).toBeLessThanOrEqual(3);
      expect(page2.items.length).toBeLessThanOrEqual(3);
      expect(mockRSSFeedRepository.find).toHaveBeenCalledTimes(2);
    });

    it('로그인하지 않은 사용자가 RSS 피드를 조회하면 에러를 던진다', async () => {
      const { getSession } = await import('@/lib/auth/session');

      // Mock 설정 - 세션이 없음
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(getRSSFeeds(1, 5)).rejects.toThrow('로그인이 필요합니다.');
    });

    it('사용자의 RSS URL이 없으면 빈 결과를 반환한다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSUrlRepository } = await import('@/lib/database/repositories');

      // Mock 설정 - 세션
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockRSSUrlRepository = {
        find: vi.fn().mockResolvedValue([]), // 사용자의 RSS URL이 없음
      };

      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );

      const result = await getRSSFeeds(1, 5);

      expect(result.items).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('기본 페이지네이션 파라미터를 사용할 때 올바르게 동작한다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSFeedRepository, getRSSUrlRepository } = await import(
        '@/lib/database/repositories'
      );

      // Mock 설정 - 세션
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockRSSUrlRepository = {
        find: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
      };

      const mockRSSFeedRepository = {
        find: vi.fn().mockResolvedValue(mockRSSFeeds.slice(0, 10)),
        count: vi.fn().mockResolvedValue(mockRSSFeeds.length),
      };

      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );
      vi.mocked(getRSSFeedRepository).mockReturnValue(
        mockRSSFeedRepository as unknown as Repository<RSSFeedEntity>
      );

      const result = await getRSSFeeds();

      expect(result.items).toBeInstanceOf(Array);
      expect(result.totalPages).toBeGreaterThan(0);
      expect(result.totalItems).toBeGreaterThan(0);
    });
  });

  describe('getRSSUrls', () => {
    it('현재 사용자의 RSS URL 목록을 반환한다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSUrlRepository } = await import('@/lib/database/repositories');

      // Mock 설정 - 세션
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockRSSUrlRepository = {
        find: vi.fn().mockResolvedValue([
          {
            id: 1,
            url: 'https://techcrunch.com/feed',
            type: 'normal',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw',
            type: 'youtube',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      };

      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );

      const feeds = await getRSSUrls();

      expect(feeds).toBeInstanceOf(Array);
      expect(feeds.length).toBe(2);
      expect(feeds[0]).toHaveProperty('id');
      expect(feeds[0]).toHaveProperty('url');
      expect(feeds[0]).toHaveProperty('type');
      expect(mockRSSUrlRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        order: { createdAt: 'DESC' },
        withDeleted: false,
      });
    });

    it('로그인하지 않은 사용자가 RSS URL을 조회하면 에러를 던진다', async () => {
      const { getSession } = await import('@/lib/auth/session');

      // Mock 설정 - 세션이 없음
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(getRSSUrls()).rejects.toThrow('로그인이 필요합니다.');
    });
  });

  describe('deleteRSSUrl', () => {
    it('현재 사용자의 RSS URL을 소프트 삭제한다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSUrlRepository } = await import('@/lib/database/repositories');

      // Mock 설정 - 세션
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockRSSUrlRepository = {
        findOne: vi.fn().mockResolvedValue(mockRSSUrl),
        softDelete: vi.fn().mockResolvedValue({ affected: 1 }),
      };

      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );

      await deleteRSSUrl('1');

      expect(mockRSSUrlRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          user: { id: 1 },
        },
      });
      expect(mockRSSUrlRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('로그인하지 않은 사용자가 RSS URL을 삭제하면 에러를 던진다', async () => {
      const { getSession } = await import('@/lib/auth/session');

      // Mock 설정 - 세션이 없음
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(deleteRSSUrl('1')).rejects.toThrow('로그인이 필요합니다.');
    });

    it('존재하지 않는 RSS URL을 삭제하려고 하면 에러를 던진다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSUrlRepository } = await import('@/lib/database/repositories');

      // Mock 설정 - 세션
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockRSSUrlRepository = {
        findOne: vi.fn().mockResolvedValue(null), // RSS URL을 찾을 수 없음
      };

      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );

      await expect(deleteRSSUrl('999')).rejects.toThrow('RSS URL 삭제에 실패했습니다.');
    });

    it('다른 사용자의 RSS URL을 삭제하려고 하면 에러를 던진다', async () => {
      const { getSession } = await import('@/lib/auth/session');
      const { getRSSUrlRepository } = await import('@/lib/database/repositories');

      // Mock 설정 - 세션 (사용자 ID: 1)
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      const mockRSSUrlRepository = {
        findOne: vi.fn().mockResolvedValue(null), // 다른 사용자의 RSS URL이므로 찾을 수 없음
      };

      vi.mocked(getRSSUrlRepository).mockReturnValue(
        mockRSSUrlRepository as unknown as Repository<RSSUrlEntity>
      );

      await expect(deleteRSSUrl('2')).rejects.toThrow('RSS URL 삭제에 실패했습니다.');
    });

    it('유효하지 않은 RSS URL ID를 전달하면 에러를 던진다', async () => {
      const { getSession } = await import('@/lib/auth/session');

      // Mock 설정 - 세션
      vi.mocked(getSession).mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        role: 'approved',
      });

      await expect(deleteRSSUrl('invalid-id')).rejects.toThrow('RSS URL 삭제에 실패했습니다.');
    });
  });
});
