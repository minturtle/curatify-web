import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PaperListSkeleton() {
  return (
    <div className="space-y-6 mb-6">
      {/* 논문 리스트 스켈레톤 */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              {/* 제목 스켈레톤 */}
              <Skeleton className="h-6 w-3/4" />

              {/* 저자 스켈레톤 */}
              <Skeleton className="h-4 w-1/2" />

              {/* 요약 스켈레톤 */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* 카테고리 및 날짜 스켈레톤 */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 페이지네이션 스켈레톤 */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-10" />
          ))}
        </div>
      </div>
    </div>
  );
}
