'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200 mb-4 group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
      <span className="text-sm font-medium">뒤로가기</span>
    </button>
  );
}
