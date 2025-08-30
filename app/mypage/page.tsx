import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/userService';
import { findUserInterests } from '@/lib/profile/userProfileService';
import UserInterestList from '@/components/profile/UserInterestList';
import AddInterestForm from '@/components/profile/AddInterestForm';
import LogoutButton from '@/components/profile/LogoutButton';

export default async function MyPage() {
  // 현재 사용자 정보 조회
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/auth');
  }

  // 사용자 관심사 조회
  const interests = await findUserInterests();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl md:px-10 mt-2">
      {/* 환영 메시지 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentUser.name}님, 환영합니다.</h1>
        <p className="text-gray-600">{currentUser.email}</p>
      </div>

      {/* 사용자 관심사 섹션 */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">사용자 관심사</h2>
          <p className="text-sm text-gray-600 mb-4">
            사용자 관심사 데이터는 논문 추천에 활용됩니다.
          </p>

          {/* 관심사 추가 폼 */}
          <div className="mb-6">
            <AddInterestForm />
          </div>

          {/* 관심사 리스트 */}
          <UserInterestList interests={interests} />
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <LogoutButton />
      </div>
    </div>
  );
}
