/**
 * RSS 서비스 테스트
 * @author Minseok kim
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { addRSSUrl, getRSSFeeds, getRSSUrls } from '@/lib/rss/rssService';
import { RSSUrlFormData } from '@/lib/types/rss';
import { Repository } from 'typeorm';
import { User } from '@/lib/database/entities/User';
import { RSSUrl as RSSUrlEntity } from '@/lib/database/entities/RSSUrl';

// Mock 모듈들
vi.mock('@/lib/database/connection', () => ({
  ensureDatabaseConnection: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/database/repositories', () => ({
  getRSSUrlRepository: vi.fn(),
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
    it('RSS 피드 목록을 페이지네이션과 함께 반환한다', async () => {
      const result = await getRSSFeeds(1, 5);

      expect(result).toBeDefined();
      expect(result.items).toBeInstanceOf(Array);
      expect(result.totalPages).toBeGreaterThan(0);
      expect(result.totalItems).toBeGreaterThan(0);
    });

    it('페이지 번호에 따라 올바른 아이템을 반환한다', async () => {
      const page1 = await getRSSFeeds(1, 3);
      const page2 = await getRSSFeeds(2, 3);

      expect(page1.items.length).toBeLessThanOrEqual(3);
      expect(page2.items.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getRSSUrls', () => {
    it('등록된 RSS 피드 목록을 반환한다', async () => {
      const feeds = await getRSSUrls();

      expect(feeds).toBeInstanceOf(Array);
      expect(feeds.length).toBeGreaterThan(0);
      expect(feeds[0]).toHaveProperty('id');
      expect(feeds[0]).toHaveProperty('url');
      expect(feeds[0]).toHaveProperty('type');
    });
  });
});
