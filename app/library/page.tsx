/**
 * 라이브러리 리스트 페이지
 * @author Minseok kim
 */

import React from 'react';
import { getUserLibrary } from '@/lib/paper/paperService';
import PaginationSSR from '@/components/ui/pagination-ssr';
import LibraryList from '@/components/library/LibraryList';

interface LibraryPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  // 페이지 파라미터 파싱
  const currentPage = parseInt((await searchParams).page ?? '1', 10);
  const pageSize = 10;

  try {
    // 사용자 라이브러리 조회
    const {
      papers,
      currentPage: page,
      totalPages,
      totalCount,
    } = await getUserLibrary(currentPage, pageSize);

    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl md:px-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">내 라이브러리</h2>
          <p className="text-gray-600">저장된 논문 {totalCount}개</p>
        </div>

        {/* 논문 리스트 */}
        <div className="mb-8">
          <LibraryList papers={papers} />
        </div>

        {/* 페이지네이션 */}
        <PaginationSSR currentPage={page} totalPages={totalPages} />
      </div>
    );
  } catch (error) {
    console.error('라이브러리 조회 중 오류 발생:', error);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">
            라이브러리를 불러오는 중 오류가 발생했습니다.
          </div>
          <div className="text-gray-400 text-sm">잠시 후 다시 시도해주세요.</div>
        </div>
      </div>
    );
  }
}
