import PaperList from '@/components/papers/PaperList';
import PaginationSSR from '@/components/ui/pagination-ssr';
import { getPapers } from '@/lib/paper/paperService';
import { getUserAuthStatus } from '@/lib/auth/userService';
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal';
import { ApprovalRequiredModal } from '@/components/auth/ApprovalRequiredModal';

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  // 인증/인가 상태 확인
  const authStatus = await getUserAuthStatus();

  if (!authStatus.authenticate_status) {
    return <AuthRequiredModal redirectTo="/auth" />;
  }

  if (!authStatus.authorize_status) {
    return <ApprovalRequiredModal userName={authStatus.user?.name} />;
  }
  // URL 파라미터에서 페이지 번호 추출 (기본값: 1)
  const currentPage = parseInt((await searchParams).page ?? '1', 10);

  // Service에서 논문 데이터 가져오기
  const { papers, totalPages } = await getPapers(currentPage, 3);

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 md:px-10 max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Reseach Paper Abstracts</h2>
            <p className="text-gray-600">
              관심 분야에 맞춰 AI가 큐레이션한 논문 요약을 만나보세요.
            </p>
          </div>
          <PaperList papers={papers} />
        </div>
        <PaginationSSR currentPage={currentPage} totalPages={totalPages} />
      </main>
    </div>
  );
}
