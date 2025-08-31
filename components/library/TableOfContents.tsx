'use client';

import React from 'react';
import ScrollSpy from 'react-scrollspy-navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';

interface PaperContentBlock {
  id: number;
  title: string;
  content: string;
  order: number;
}

interface TableOfContentsProps {
  content: PaperContentBlock[];
}

/**
 * 논문 목차 컴포넌트
 * react-scrollspy-navigation을 사용하여 스크롤 스파이 기능 제공
 * 스티키 포지션으로 스크롤 시에도 고정됨
 */
export default function TableOfContents({ content }: TableOfContentsProps) {
  // 콘텐츠 블록이 2개 이상일 때만 목차 표시
  if (content.length <= 1) {
    return null;
  }
  console.log(content);
  return (
    <div className="sticky top-4 z-10 mb-6">
      <Card className="max-h-[calc(100vh-2rem)] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <List className="w-5 h-5" />
            목차
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollSpy activeClass="text-blue-600 font-semibold" offsetTop={120}>
            <nav>
              <ul className="space-y-2">
                {content.map((contentBlock) => (
                  <li key={contentBlock.id}>
                    <a
                      href={`#section-${contentBlock.id}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 block py-2 px-3 rounded-md hover:bg-gray-50"
                    >
                      {contentBlock.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollSpy>
        </CardContent>
      </Card>
    </div>
  );
}
