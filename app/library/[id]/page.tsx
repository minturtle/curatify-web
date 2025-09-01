/**
 * 논문 상세 페이지
 * @author Minseok kim
 */

import React from 'react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getPaperDetail } from '@/lib/paper/paperService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Users, FileText } from 'lucide-react';
import BackButton from '@/app/library/[id]/BackButton';
import TableOfContents from '@/components/library/TableOfContents';
import { getUserAuthStatus } from '@/lib/auth/userService';
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal';
import { ApprovalRequiredModal } from '@/components/auth/ApprovalRequiredModal';

interface PageProps {
  params: {
    id: string;
  };
}

/**
 * 메타데이터 생성 함수
 */
export async function generateMetadata({ params }: PageProps) {
  try {
    const paperDetail = await getPaperDetail(parseInt(params.id));

    if (!paperDetail) {
      return {
        title: '논문을 찾을 수 없습니다 | Curatify',
        description: '요청하신 논문을 찾을 수 없습니다.',
      };
    }

    // content 배열에서 첫 번째 블록의 content를 사용하여 설명 생성
    const firstContent = paperDetail.content[0]?.content || '';
    const description = firstContent.substring(0, 160) + (firstContent.length > 160 ? '...' : '');

    return {
      title: `${paperDetail.title} | Curatify`,
      description,
      openGraph: {
        title: paperDetail.title,
        description,
        type: 'article',
        authors: paperDetail.authors,
      },
    };
  } catch {
    return {
      title: '논문 상세 | Curatify',
      description: '논문 상세 정보를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 논문 상세 페이지 컴포넌트
 */
export default async function PaperDetailPage({ params }: PageProps) {
  // 인증/인가 상태 확인
  const authStatus = await getUserAuthStatus();
  
  if (!authStatus.authenticate_status) {
    return <AuthRequiredModal redirectTo="/auth" />;
  }
  
  if (!authStatus.authorize_status) {
    return <ApprovalRequiredModal userName={authStatus.user?.name} />;
  }

  try {
    const paperId = parseInt(params.id);

    if (isNaN(paperId)) {
      notFound();
    }

    const paperDetail = await getPaperDetail(paperId);

    if (!paperDetail) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 뒤로가기 버튼 */}
        <BackButton />

        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{paperDetail.title}</h1>

          {/* 저자 정보 */}
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">저자:</span>
            <div className="flex flex-wrap gap-1">
              {paperDetail.authors.map((author, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {author}
                </Badge>
              ))}
            </div>
          </div>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>생성일: {paperDetail.createdAt.toLocaleDateString('ko-KR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>발행일: {paperDetail.publishedAt.toLocaleDateString('ko-KR')}</span>
            </div>
          </div>

          {/* 외부 링크 */}
          {paperDetail.url && (
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <a
                  href={paperDetail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  원문 보기
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* 목차와 메인 콘텐츠 그리드 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  {paperDetail.content.map((contentBlock) => (
                    <div key={contentBlock.id} id={`section-${contentBlock.id}`} className="mb-12">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {contentBlock.content}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 목차 사이드바 */}
          <div className="lg:col-span-1">
            <TableOfContents content={paperDetail.content} />
          </div>
        </div>

        {/* 추가 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>논문 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">저자 수:</span>
                <span className="ml-2 text-gray-600">{paperDetail.authors.length}명</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">생성일:</span>
                <span className="ml-2 text-gray-600">
                  {paperDetail.createdAt.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">발행일:</span>
                <span className="ml-2 text-gray-600">
                  {paperDetail.publishedAt.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('논문 상세 페이지 로딩 중 오류:', error);

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              논문 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}
