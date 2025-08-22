/**
 * RSS 서비스 테스트
 * @author Minseok kim
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { addRSSUrl, getRSSFeeds, getRSSUrls } from '@/lib/services/rssService';
import { RSSUrlFormData } from '@/lib/types/rss';

describe('RSS Service', () => {
  beforeEach(() => {
    // 각 테스트 전에 데이터 초기화
    // 실제로는 데이터베이스 초기화가 필요
  });

  describe('addRSSFeed', () => {
    it('유효한 RSS URL을 등록할 때 에러가 발생하지 않는다', async () => {
      const formData: RSSUrlFormData = {
        url: 'https://example.com/rss',
        type: 'rss',
      };

      await expect(addRSSUrl(formData)).resolves.not.toThrow();
    });

    it('유효한 YouTube URL을 등록할 때 에러가 발생하지 않는다', async () => {
      const formData: RSSUrlFormData = {
        url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw',
        type: 'youtube',
      };

      await expect(addRSSUrl(formData)).resolves.not.toThrow();
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
      // 먼저 RSS 피드 등록
      await addRSSUrl({
        url: 'https://example.com/rss',
        type: 'rss',
      });

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
