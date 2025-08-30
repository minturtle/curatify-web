/**
 * RSS 아이템 카드 컴포넌트
 * @author Minseok kim
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RSSFeed } from '@/lib/types/rss';
import ReactMarkdown from 'react-markdown';

interface RSSFeedCardProps {
  item: RSSFeed;
}

export default function RSSFeedCard({ item }: RSSFeedCardProps) {
  const formatDate = (date: Date) => {
    try {
      // Date 객체가 유효한지 확인
      if (!date || isNaN(date.getTime())) {
        return '날짜 정보 없음';
      }

      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('날짜 형식 오류:', error);
      return '날짜 형식 오류';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          <a
            href={item.originalUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {item.title}
          </a>
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{formatDate(item.writedAt)}</span>
          {item.rssUrl && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                item.rssUrl.type === 'youtube'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {item.rssUrl.type === 'youtube' ? 'YouTube' : 'RSS'}
            </span>
          )}
        </div>
      </CardHeader>
      {item.summary && (
        <CardContent className="pt-0">
          <div className="text-gray-700 line-clamp-3 prose prose-sm max-w-none">
            <ReactMarkdown>{item.summary}</ReactMarkdown>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
