/**
 * 논문 리스트 서버 컴포넌트
 * @author Minseok kim
 */

import React from 'react';
import { getPapers } from '@/lib/paper/paperService';
import PaperCard from './PaperCard';
import PaginationSSR from '@/components/ui/pagination-ssr';

interface PaperListProps {
  searchParams: {
    page?: string;
    search?: string;
    categories?: string;
    year?: string;
    sort?: string;
  };
}

export default async function PaperList({ searchParams }: PaperListProps) {
  // URL 파라미터에서 검색 조건 추출
  const currentPage = parseInt(searchParams.page ?? '1', 10);
  const searchQuery = searchParams.search;
  const categories = searchParams.categories;
  const publicationYear = searchParams.year;
  const sortBy = searchParams.sort;

  // 논문 데이터 가져오기
  const { papers, totalPages } = await getPapers(
    currentPage,
    5,
    searchQuery,
    categories,
    publicationYear,
    sortBy
  );

  return (
    <div className="space-y-6 mb-6">
      {/* 논문 리스트 */}
      <div className="space-y-4">
        {papers.length > 0 ? (
          papers.map((paper) => <PaperCard key={paper.id} paper={paper} />)
        ) : (
          <div className="text-center py-12 mt-20">
            <div className="text-gray-500 text-lg">아직 논문이 준비되지 않았습니다.</div>
            <div className="text-gray-400 text-sm mt-2">
              논문이 준비될 때까지 잠시만 기다려주세요.
            </div>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <PaginationSSR currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
