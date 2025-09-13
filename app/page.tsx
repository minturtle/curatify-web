import PaperList from '@/components/papers/PaperList';
import PaperSearch from '@/components/papers/PaperSearch';
import { getCategories } from '@/lib/paper/paperService';
import { getUserAuthStatus } from '@/lib/auth/userService';
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal';
import { ApprovalRequiredModal } from '@/components/auth/ApprovalRequiredModal';

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';

export default async function Home() {
  // 인증/인가 상태 확인
  const authStatus = await getUserAuthStatus();

  if (!authStatus.authenticate_status) {
    return <AuthRequiredModal redirectTo="/auth" />;
  }

  if (!authStatus.authorize_status) {
    return <ApprovalRequiredModal userName={authStatus.user?.name} />;
  }

  // 카테고리 목록 가져오기
  const categoryList = await getCategories();

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 md:px-10 max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Reseach Paper Abstracts</h2>
            <p className="text-gray-600">AI가 요약한 초록을 빠르게 확인해보세요.</p>
          </div>

          {/* 검색 컴포넌트 */}
          <PaperSearch categories={categoryList} />

          {/* 논문 리스트 */}
          <PaperList />
        </div>
      </main>
    </div>
  );
}
