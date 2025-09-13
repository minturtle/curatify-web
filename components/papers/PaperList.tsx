/**
 * 논문 리스트 클라이언트 컴포넌트
 * @author Minseok kim
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PaperCard from './PaperCard';
import CustomPagination from '@/components/ui/custom-pagination';
import PaperListSkeleton from './PaperListSkeleton';

interface Paper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  link: string;
  lastUpdate: string;
  categories: string[];
}

interface PaperListResponse {
  papers: Paper[];
  totalPages: number;
}

export default function PaperList() {
  const [data, setData] = useState<PaperListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // URL 파라미터에서 검색 조건 추출
  const currentPage = parseInt(searchParams.get('page') ?? '1');
  const searchQuery = searchParams.get('search');
  const categories = searchParams.get('categories');
  const publicationYear = searchParams.get('year');
  const sortBy = searchParams.get('sort');

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        setError(null);

        // API 엔드포인트에 쿼리 파라미터 추가
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '5',
        });

        if (searchQuery) params.append('search', searchQuery);
        if (categories) params.append('categories', categories);
        if (publicationYear) params.append('year', publicationYear);
        if (sortBy) params.append('sort', sortBy);

        const response = await fetch(`/api/papers?${params.toString()}`);

        if (!response.ok) {
          throw new Error('논문 데이터를 가져오는데 실패했습니다.');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [currentPage, searchQuery, categories, publicationYear, sortBy]);

  // 로딩 중일 때 스켈레톤 표시
  if (loading) {
    return <PaperListSkeleton />;
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="text-center py-12 mt-20">
        <div className="text-red-500 text-lg">오류가 발생했습니다.</div>
        <div className="text-gray-400 text-sm mt-2">{error}</div>
      </div>
    );
  }

  // 데이터가 없을 때
  if (!data) {
    return (
      <div className="text-center py-12 mt-20">
        <div className="text-gray-500 text-lg">데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      {/* 논문 리스트 */}
      <div className="space-y-4">
        {data.papers.length > 0 ? (
          data.papers.map((paper) => <PaperCard key={paper.id} paper={paper} />)
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
      <CustomPagination currentPage={currentPage} totalPages={data.totalPages} />
    </div>
  );
}
