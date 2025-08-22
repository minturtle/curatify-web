/**
 * 논문 리스트 서버 컴포넌트
 * @author Minseok kim
 */

import React from 'react';
import { PaperListProps } from '@/lib/types/paper';
import PaperCard from './PaperCard';
import PaginationSSR from '@/components/ui/pagination-ssr';

export default function PaperList({ papers, currentPage, totalPages }: PaperListProps) {
  return (
    <div className="space-y-6">
      {/* 논문 리스트 */}
      <div className="space-y-4">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <PaginationSSR currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
