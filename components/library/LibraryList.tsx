/**
 * 라이브러리 리스트 컴포넌트
 * @author Minseok kim
 */

import React from 'react';
import { UserLibrary } from '@/lib/types/paper';
import LibraryCard from './LibraryCard';

interface LibraryListProps {
  papers: UserLibrary[];
}

export default function LibraryList({ papers }: LibraryListProps) {
  if (papers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">아직 저장한 논문이 없습니다.</div>
        <div className="text-gray-400 text-sm">논문을 심층 분석하여 라이브러리에 저장해보세요.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {papers.map((paper) => (
        <LibraryCard key={paper.paperContentId} paper={paper} />
      ))}
    </div>
  );
}
