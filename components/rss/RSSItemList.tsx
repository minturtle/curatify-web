/**
 * RSS 아이템 목록 컴포넌트
 * @author Minseok kim
 */

import { RSSItem } from '@/lib/types/rss';
import RSSItemCard from './RSSItemCard';

interface RSSItemListProps {
  items: RSSItem[];
}

export default function RSSItemList({ items }: RSSItemListProps) {
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
        <RSSItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
