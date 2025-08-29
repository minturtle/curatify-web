/**
 * RSS 아이템 목록 컴포넌트
 * @author Minseok kim
 */

import RSSFeedCard from './RSSFeedCard';
import { getRSSFeeds } from '@/lib/rss/rssService';
import PaginationSSR from '@/components/ui/pagination-ssr';

interface RSSFeedListProps {
  currentPage: number;
}

export default async function RSSFeedList({ currentPage }: RSSFeedListProps) {
  // RSS 아이템 데이터 가져오기
  const { items, totalPages } = await getRSSFeeds(currentPage, 3);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">등록된 RSS 피드가 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">RSS URL을 등록하여 최신 소식을 받아보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <RSSFeedCard key={item.id} item={item} />
      ))}
      {/* 페이지네이션 */}
      <PaginationSSR currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
