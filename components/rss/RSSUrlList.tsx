/**
 * RSS URL 목록 컴포넌트
 * @author Minseok kim
 */

import { getRSSUrls } from '@/lib/rss/rssService';
import RSSUrlCard from './RSSUrlCard';

export default async function RSSUrlList() {
  // RSS URL 데이터 가져오기
  const urls = await getRSSUrls();

  if (urls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">등록된 RSS URL이 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">RSS URL을 등록하여 최신 소식을 받아보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {urls.map((url) => (
        <RSSUrlCard key={url.id} url={url} />
      ))}
    </div>
  );
}
