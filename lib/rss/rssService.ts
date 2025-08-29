'use server';

/**
 * RSS 서비스
 * @author Minseok kim
 */

import { RSSFeed, RSSUrl, RSSUrlFormData, PaginatedRSSFeeds, RSSType } from '@/lib/types/rss';
import { ensureDatabaseConnection } from '@/lib/database/connection';
import {
  getRSSUrlRepository,
  getUserRepository,
  getRSSFeedRepository,
} from '@/lib/database/repositories';
import { RSSUrl as RSSUrlEntity } from '@/lib/database/entities/RSSUrl';
import { RSSFeed as RSSFeedEntity } from '@/lib/database/entities/RSSFeed';
import { publishJson } from '@/lib/redis/client';
import { getSession } from '@/lib/auth/session';
import { In } from 'typeorm';

// Mock 데이터 - RSS 피드 목록
const mockUrls: RSSUrl[] = [
  {
    id: '1',
    url: 'https://techcrunch.com/feed',
    type: 'rss',
  },
  {
    id: '2',
    url: 'https://www.theverge.com/rss/index.xml',
    type: 'rss',
  },
  {
    id: '3',
    url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw',
    type: 'youtube',
  },
];

/**
 * RSS 피드 등록
 */
export async function addRSSUrl(formData: RSSUrlFormData) {
  // URL 유효성 검사
  if (!formData.url || !isValidURL(formData.url)) {
    throw new Error('유효하지 않은 URL입니다.');
  }

  // 타입 유효성 검사
  if (!formData.type || !['rss', 'youtube'].includes(formData.type)) {
    throw new Error('유효하지 않은 RSS 타입입니다.');
  }

  // YouTube URL 검증 (YouTube 타입인 경우)
  if (formData.type === 'youtube' && !isValidYouTubeURL(formData.url)) {
    throw new Error('유효하지 않은 YouTube URL입니다.');
  }

  // 세션에서 사용자 ID 가져오기
  const session = await getSession();
  if (!session || !session.userId) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    // 데이터베이스 연결 확인
    await ensureDatabaseConnection();

    // RSSUrl 엔티티 가져오기
    const RSSUrlRepository = getRSSUrlRepository();
    const UserRepository = getUserRepository();

    const user = await UserRepository.findOne({ where: { id: session.userId } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const rssUrl = new RSSUrlEntity();
    rssUrl.url = formData.url;
    rssUrl.type = formData.type === 'youtube' ? 'youtube' : 'normal';
    rssUrl.user = user;

    const savedRssUrl = await RSSUrlRepository.save(rssUrl);

    // Redis 채널에 RSS URL + RSS Type + 사용자 ID publish
    const publishData = {
      url: formData.url,
      type: formData.type,
      userId: session.userId,
      rssUrlId: savedRssUrl.id,
    };

    await publishJson('rss:update_feeds', publishData);

    return savedRssUrl;
  } catch (error) {
    console.error('RSS URL 등록 중 오류 발생:', error);
    throw new Error('RSS URL 등록에 실패했습니다.');
  }
}

/**
 * RSS 아이템 목록 조회 (페이지네이션) - 현재 사용자만
 */
export async function getRSSFeeds(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedRSSFeeds> {
  try {
    // 세션에서 사용자 ID 가져오기
    const session = await getSession();
    if (!session || !session.userId) {
      throw new Error('로그인이 필요합니다.');
    }

    // 데이터베이스 연결 확인
    await ensureDatabaseConnection();

    // RSSFeed repository 가져오기
    const RSSFeedRepository = getRSSFeedRepository();

    // 현재 사용자의 RSS URL ID 목록 조회
    const RSSUrlRepository = getRSSUrlRepository();
    const userRSSUrls = await RSSUrlRepository.find({
      where: { user: { id: session.userId } },
      select: ['id'],
    });

    const userRSSUrlIds = userRSSUrls.map((url) => url.id);

    // 사용자의 RSS URL이 없는 경우 빈 결과 반환
    if (userRSSUrlIds.length === 0) {
      return {
        items: [],
        totalPages: 0,
        totalItems: 0,
      };
    }

    // 전체 아이템 수 조회 (현재 사용자만)
    const totalItems = await RSSFeedRepository.count({
      where: { rssUrl: { id: In(userRSSUrlIds) } },
    });

    // 페이지네이션 계산
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalItems / limit);

    // RSS 피드 조회 (최신순 정렬, 현재 사용자만)
    const feeds = await RSSFeedRepository.find({
      where: { rssUrl: { id: In(userRSSUrlIds) } },
      order: {
        writedAt: 'DESC',
        createdAt: 'DESC',
      },
      skip,
      take: limit,
      relations: ['rssUrl'],
    });

    // 타입 변환 (DB 엔티티 → 타입 정의)
    const items: RSSFeed[] = await Promise.all(
      feeds.map(async (feed) => ({
        id: feed.id.toString(),
        title: feed.title,
        summary: feed.summary || undefined,
        writedAt: feed.writedAt,
        originalUrl: feed.originalUrl || undefined,
        createdAt: feed.createdAt,
        updatedAt: feed.updatedAt,
        rssUrl: feed.rssUrl
          ? ({
              id: (await feed.rssUrl).id.toString(),
              url: (await feed.rssUrl).url,
              type: (await feed.rssUrl).type as RSSType,
            } as RSSUrl)
          : undefined,
      }))
    );

    return {
      items,
      totalPages,
      totalItems,
    };
  } catch (error) {
    // 로그인 관련 에러는 원본 메시지 유지
    if (error instanceof Error && error.message === '로그인이 필요합니다.') {
      throw error;
    }

    console.error('RSS 피드 조회 중 오류 발생:', error);
    throw new Error('RSS 피드 조회에 실패했습니다.');
  }
}

/**
 * RSS 피드 URL 조회 - 현재 사용자만
 */
export async function getRSSUrls(): Promise<RSSUrl[]> {
  try {
    // 세션에서 사용자 ID 가져오기
    const session = await getSession();
    if (!session || !session.userId) {
      throw new Error('로그인이 필요합니다.');
    }

    // 데이터베이스 연결 확인
    await ensureDatabaseConnection();

    // RSSUrl repository 가져오기
    const RSSUrlRepository = getRSSUrlRepository();

    // 현재 사용자의 RSS URL 목록 조회
    const rssUrls = await RSSUrlRepository.find({
      where: { user: { id: session.userId } },
      order: {
        createdAt: 'DESC',
      },
    });

    // 타입 변환 (DB 엔티티 → 타입 정의)
    const items: RSSUrl[] = rssUrls.map((rssUrl) => ({
      id: rssUrl.id.toString(),
      url: rssUrl.url,
      type: rssUrl.type === 'youtube' ? 'youtube' : 'rss',
    }));

    return items;
  } catch (error) {
    // 로그인 관련 에러는 원본 메시지 유지
    if (error instanceof Error && error.message === '로그인이 필요합니다.') {
      throw error;
    }

    console.error('RSS URL 조회 중 오류 발생:', error);
    throw new Error('RSS URL 조회에 실패했습니다.');
  }
}

/**
 * URL 유효성 검사
 */
function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * YouTube URL 유효성 검사
 */
function isValidYouTubeURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
  } catch {
    return false;
  }
}
