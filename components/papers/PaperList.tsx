/**
 * 논문 리스트 서버 컴포넌트
 * @author Minseok kim
 */

import React from 'react';
import { PaperListProps } from '@/lib/types/paper';
import PaperCard from './PaperCard';

export default function PaperList({ papers }: PaperListProps) {
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
    </div>
  );
}
