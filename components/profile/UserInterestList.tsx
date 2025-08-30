import { UserInterestsType } from '@/lib/types/user';
import UserInterestCard from './UserInterestCard';

interface UserInterestListProps {
  interests: UserInterestsType[];
}

export default function UserInterestList({ interests }: UserInterestListProps) {
  if (interests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>아직 등록된 관심사가 없습니다.</p>
        <p className="text-sm mt-1">새로운 관심사를 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interests.map((interest) => (
        <UserInterestCard key={interest.interestsId} interest={interest} />
      ))}
    </div>
  );
}
