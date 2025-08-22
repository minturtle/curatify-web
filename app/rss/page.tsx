/**
 * RSS 페이지
 * @author Minseok kim
 */

import RSSUrlForm from '@/components/rss/RSSUrlForm';
import RSSFeedList from '@/components/rss/RSSFeedList';
import PaginationSSR from '@/components/ui/pagination-ssr';
import { getRSSFeeds } from '@/lib/services/rssService';

interface RSSPageProps {
  searchParams: { page?: string };
}

export default async function RSSPage({ searchParams }: RSSPageProps) {
  // URL 파라미터에서 페이지 번호 추출 (기본값: 1)
  const currentPage = parseInt((await searchParams).page ?? '1');

  // RSS 아이템 데이터 가져오기
  const { items, totalPages } = await getRSSFeeds(currentPage, 3);

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">RSS 소식</h1>
          <RSSUrlForm />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="mb-8 md:px-10">
          {/* 업데이트 안내 문구 */}
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-500">매일 새벽 2시에 RSS 피드가 업데이트됩니다.</p>
          </div>

          {/* RSS 아이템 목록 */}
          <RSSFeedList items={items} />
        </div>

        {/* 페이지네이션 */}
        <PaginationSSR currentPage={currentPage} totalPages={totalPages} />
      </main>
    </div>
  );
}
