/**
 * RSS 아이템 카드 컴포넌트
 * @author Minseok kim
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RSSFeed } from '@/lib/types/rss';

interface RSSFeedCardProps {
  item: RSSFeed;
}

export default function RSSFeedCard({ item }: RSSFeedCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {item.title}
          </a>
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{formatDate(item.pubDate)}</span>
          {item.author && <span>작성자: {item.author}</span>}
        </div>
      </CardHeader>
      {item.description && (
        <CardContent className="pt-0">
          <p className="text-gray-700 line-clamp-3">{item.description}</p>
        </CardContent>
      )}
    </Card>
  );
}
