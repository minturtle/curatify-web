/**
 * RSS 페이지
 * @author Minseok kim
 */

import RSSUrlForm from '@/components/rss/RSSUrlForm';
import RSSFeedList from '@/components/rss/RSSFeedList';
import RSSUrlList from '@/components/rss/RSSUrlList';
import { Info } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getUserAuthStatus } from '@/lib/auth/userService';
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal';
import { ApprovalRequiredModal } from '@/components/auth/ApprovalRequiredModal';
interface RSSPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function RSSPage({ searchParams }: RSSPageProps) {
  // 인증/인가 상태 확인
  const authStatus = await getUserAuthStatus();

  if (!authStatus.authenticate_status) {
    return <AuthRequiredModal redirectTo="/auth" />;
  }

  if (!authStatus.authorize_status) {
    return <ApprovalRequiredModal userName={authStatus.user?.name} />;
  }

  // URL 파라미터에서 페이지 번호 추출 (기본값: 1)
  const currentPage = parseInt((await searchParams).page ?? '1');

  return (
    <div>
      <main className="container mx-auto px-4 py-8 max-w-8xl">
        {/* 페이지 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">RSS 소식</h1>
          <RSSUrlForm />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="mb-8 md:px-10">
          {/* 업데이트 안내 문구 */}
          <div className="flex gap-2 justify-end">
            <Info className="w-4 h-4 text-gray-500 mb-4" />
            <p className="text-sm text-gray-500">매일 오전/오후 2시에 RSS 피드가 업데이트됩니다.</p>
          </div>
          <Tabs defaultValue="feeds" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="feeds" className="cursor-pointer">
                피드
              </TabsTrigger>
              <TabsTrigger value="management" className="cursor-pointer">
                RSS 관리
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feeds" className="space-y-4">
              {/* RSS 아이템 목록 */}
              <RSSFeedList currentPage={currentPage} />
            </TabsContent>

            <TabsContent value="management" className="space-y-4">
              {/* RSS URL 목록 */}
              <div>
                <RSSUrlList />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
