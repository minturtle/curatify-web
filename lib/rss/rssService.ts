'use server';

/**
 * RSS 서비스
 * @author Minseok kim
 */

import { RSSFeed, RSSUrl, RSSUrlFormData, PaginatedRSSFeeds, type RSSType } from '@/lib/types/rss';
import { ensureDatabaseConnection } from '@/lib/database/connection';
import { publishJson } from '@/lib/redis/client';
import mongoose from 'mongoose';
import {
  RSSUrl as RSSUrlModel,
  type IRSSUrl,
  RSSFeed as RSSFeedModel,
  type IRSSFeed,
} from '@/lib/database/entities';
import { getUserAuthStatus } from '../auth/userService';

/**
 * RSS 피드 등록
 */
export async function addRSSUrl(formData: RSSUrlFormData) {
  // URL 유효성 검사
  if (!formData.url || !isValidURL(formData.url)) {
    throw new Error('유효하지 않은 URL입니다.');
  }

  // YouTube URL 검증 (YouTube 타입인 경우)
  if (formData.type === 'youtube' && !isValidYouTubeURL(formData.url)) {
    throw new Error('유효하지 않은 YouTube URL입니다.');
  }

  try {
    // 데이터베이스 연결 확인
    await ensureDatabaseConnection();

    const currentUser = await getUserAuthStatus();
    if (!currentUser.authenticate_status) {
      throw new Error('로그인이 필요합니다.');
    }
    if (!currentUser.authorize_status) {
      throw new Error('사용자 권한이 없습니다.');
    }

    // 새 RSS URL 생성
    const rssUrl = new RSSUrlModel({
      url: formData.url,
      type: formData.type === 'youtube' ? 'youtube' : 'normal',
      userId: currentUser.user?.id,
    });

    const savedRssUrl = await rssUrl.save();

    // Redis 채널에 RSS URL + RSS Type + 사용자 ID publish
    const publishData = {
      url: formData.url,
      type: formData.type,
      userId: currentUser.user?.id,
      rssUrlId: (savedRssUrl._id as mongoose.Types.ObjectId).toString(),
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
    // 데이터베이스 연결 확인
    await ensureDatabaseConnection();

    const currentUser = await getUserAuthStatus();
    if (!currentUser.authenticate_status) {
      throw new Error('로그인이 필요합니다.');
    }
    if (!currentUser.authorize_status) {
      throw new Error('사용자 권한이 없습니다.');
    }
    // 현재 사용자의 RSS URL ID 목록 조회
    const userRSSUrls = await RSSUrlModel.find({
      userId: currentUser.user?.id,
    }).select('_id');

    const userRSSUrlIds = userRSSUrls.map((url: IRSSUrl) => url._id);

    // 사용자의 RSS URL이 없는 경우 빈 결과 반환
    if (userRSSUrlIds.length === 0) {
      return {
        items: [],
        totalPages: 0,
        totalItems: 0,
      };
    }

    // 전체 아이템 수 조회 (현재 사용자만)
    const totalItems = await RSSFeedModel.countDocuments({
      rssUrl: { $in: userRSSUrlIds },
    });

    // 페이지네이션 계산
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalItems / limit);

    // RSS 피드 조회 (최신순 정렬, 현재 사용자만)
    const feeds = await RSSFeedModel.find({
      rssUrl: { $in: userRSSUrlIds },
    })
      .sort({ writedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('rssUrl', 'url type');

    // 타입 변환 (DB 엔티티 → 타입 정의)
    const items: RSSFeed[] = feeds.map((feed: IRSSFeed) => ({
      id: (feed._id as mongoose.Types.ObjectId).toString(),
      title: feed.title,
      summary: feed.summary || undefined,
      writedAt: feed.writedAt,
      originalUrl: feed.originalUrl || undefined,
      createdAt: feed.createdAt,
      updatedAt: feed.updatedAt,
      rssUrl:
        feed.rssUrl && typeof feed.rssUrl === 'object' && '_id' in feed.rssUrl
          ? ({
              id: (
                feed.rssUrl as unknown as {
                  _id: mongoose.Types.ObjectId;
                  url: string;
                  type: string;
                }
              )._id.toString(),
              url: (
                feed.rssUrl as unknown as {
                  _id: mongoose.Types.ObjectId;
                  url: string;
                  type: string;
                }
              ).url,
              type: (
                feed.rssUrl as unknown as {
                  _id: mongoose.Types.ObjectId;
                  url: string;
                  type: string;
                }
              ).type as RSSType,
            } as RSSUrl)
          : undefined,
    }));

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
    // 데이터베이스 연결 확인
    await ensureDatabaseConnection();

    const currentUser = await getUserAuthStatus();
    if (!currentUser.authenticate_status) {
      throw new Error('로그인이 필요합니다.');
    }
    if (!currentUser.authorize_status) {
      throw new Error('사용자 권한이 없습니다.');
    }

    // 현재 사용자의 RSS URL 목록 조회
    const rssUrls = await RSSUrlModel.find({
      userId: currentUser.user?.id,
    })
      .sort({ createdAt: -1 })
      .where('deletedAt')
      .equals(null); // 삭제되지 않은 것만

    // 타입 변환 (DB 엔티티 → 타입 정의)
    const items: RSSUrl[] = rssUrls.map((rssUrl: IRSSUrl) => ({
      id: (rssUrl._id as mongoose.Types.ObjectId).toString(),
      url: rssUrl.url,
      type: rssUrl.type === 'youtube' ? 'youtube' : 'normal',
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
 * RSS URL 삭제 (소프트 삭제)
 */
export async function deleteRSSUrl(rssUrlId: string): Promise<void> {
  try {
    // 데이터베이스 연결 확인
    await ensureDatabaseConnection();

    const currentUser = await getUserAuthStatus();
    if (!currentUser.authenticate_status) {
      throw new Error('로그인이 필요합니다.');
    }
    if (!currentUser.authorize_status) {
      throw new Error('사용자 권한이 없습니다.');
    }

    // ObjectId 유효성 검사
    if (!mongoose.Types.ObjectId.isValid(rssUrlId)) {
      throw new Error('유효하지 않은 RSS URL ID입니다.');
    }

    // RSS URL 조회 (현재 사용자의 것만)
    const rssUrl = await RSSUrlModel.findOne({
      _id: rssUrlId,
      userId: currentUser.user?.id,
    });

    if (!rssUrl) {
      throw new Error('RSS URL을 찾을 수 없습니다.');
    }

    // 소프트 삭제 실행 (deletedAt 필드 설정)
    rssUrl.deletedAt = new Date();
    await rssUrl.save();
  } catch (error) {
    // 로그인 관련 에러는 원본 메시지 유지
    if (error instanceof Error && error.message === '로그인이 필요합니다.') {
      throw error;
    }

    console.error('RSS URL 삭제 중 오류 발생:', error);
    throw new Error('RSS URL 삭제에 실패했습니다.');
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
