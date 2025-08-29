'use server';

/**
 * RSS 서비스
 * @author Minseok kim
 */

import { RSSFeed, RSSUrl, RSSUrlFormData } from '@/lib/types/rss';
import { ensureDatabaseConnection } from '@/lib/database/connection';
import { getRSSUrlRepository, getUserRepository } from '@/lib/database/repositories';
import { RSSUrl as RSSUrlEntity } from '@/lib/database/entities/RSSUrl';
import { User } from '@/lib/database/entities/User';
import { publishJson } from '@/lib/redis/client';
import { getSession } from '@/lib/auth/session';

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

// Mock 데이터 - RSS 아이템 목록
const mockFeeds: RSSFeed[] = [
  {
    id: '1',
    feedId: '1',
    title: 'AI 기술의 새로운 발전: GPT-5 출시 예정',
    description:
      'OpenAI가 GPT-5 출시를 앞두고 있으며, 이번 버전에서는 더욱 향상된 자연어 처리 능력을 제공할 예정입니다.',
    link: 'https://techcrunch.com/2024/01/15/ai-gpt5-release',
    pubDate: new Date('2024-01-15T10:00:00Z'),
    author: 'John Smith',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    feedId: '1',
    title: '메타버스 플랫폼의 미래 전망',
    description:
      '메타버스 기술이 어떻게 우리의 일상생활을 변화시킬지에 대한 심층 분석을 제공합니다.',
    link: 'https://techcrunch.com/2024/01-14/metaverse-future',
    pubDate: new Date('2024-01-14T15:30:00Z'),
    author: 'Jane Doe',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    feedId: '2',
    title: '새로운 스마트폰 기술 트렌드',
    description: '2024년 스마트폰 시장의 주요 기술 트렌드와 향후 발전 방향을 살펴봅니다.',
    link: 'https://www.theverge.com/2024/01/13/smartphone-trends',
    pubDate: new Date('2024-01-13T09:15:00Z'),
    author: 'Mike Johnson',
    createdAt: new Date('2024-01-13'),
  },
  {
    id: '4',
    feedId: '2',
    title: '클라우드 컴퓨팅의 새로운 패러다임',
    description:
      '클라우드 컴퓨팅 기술의 최신 동향과 기업들이 어떻게 이를 활용하고 있는지 알아봅니다.',
    link: 'https://www.theverge.com/2024/01/12/cloud-computing-paradigm',
    pubDate: new Date('2024-01-12T14:20:00Z'),
    author: 'Sarah Wilson',
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '5',
    feedId: '1',
    title: '블록체인 기술의 실제 활용 사례',
    description:
      '블록체인 기술이 금융, 의료, 물류 등 다양한 분야에서 어떻게 활용되고 있는지 살펴봅니다.',
    link: 'https://techcrunch.com/2024/01/11/blockchain-use-cases',
    pubDate: new Date('2024-01-11T11:45:00Z'),
    author: 'David Brown',
    createdAt: new Date('2024-01-11'),
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
 * RSS 아이템 목록 조회 (페이지네이션)
 */
export async function getRSSFeeds(
  page: number = 1,
  limit: number = 10
): Promise<{
  items: RSSFeed[];
  totalPages: number;
  totalItems: number;
}> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // 최신순으로 정렬
  const sortedItems = [...mockFeeds].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  const paginatedItems = sortedItems.slice(startIndex, endIndex);
  const totalItems = mockFeeds.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: paginatedItems,
    totalPages,
    totalItems,
  };
}

/**
 * RSS 피드 목록 조회
 */
export async function getRSSUrls(): Promise<RSSUrl[]> {
  return mockUrls;
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
