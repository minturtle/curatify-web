/**
 * 라이브러리 카드 컴포넌트
 * @author Minseok kim
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Calendar, Users } from 'lucide-react';
import { UserLibrary } from '@/lib/types/paper';

interface LibraryCardProps {
  paper: UserLibrary;
}

export default function LibraryCard({ paper }: LibraryCardProps) {
  return (
    <Link href={`/library/${paper.paperContentId}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer mb-2">
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* 저자 정보 */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              <strong>저자:</strong> {paper.authors.join(', ')}
            </span>
          </div>

          {/* 저장 날짜 */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              <strong>저장일:</strong> {paper.createdAt.toLocaleDateString('ko-KR')}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
