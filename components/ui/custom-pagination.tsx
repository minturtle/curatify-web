/**
 * SSR 전용 페이지네이션 컴포넌트
 * @author Minseok kim
 */

'use client';

import React from 'react';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

interface PaginationSSRProps {
  currentPage: number;
  totalPages: number;
}

export default function CustomPagination({ currentPage, totalPages }: PaginationSSRProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  // 페이지 범위 계산 함수
  const getPageRange = () => {
    // 현재 페이지를 중심으로 앞뒤 1개씩, 총 3개 표시
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    // 처음 2페이지에서는 2개만 표시
    if (currentPage <= 2) {
      startPage = 1;
      endPage = Math.min(2, totalPages);
    }

    // 마지막 2페이지에서는 2개만 표시
    if (currentPage >= totalPages - 1) {
      startPage = Math.max(1, totalPages - 1);
      endPage = totalPages;
    }

    return { startPage, endPage };
  };

  const { startPage, endPage } = getPageRange();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage === 1 ? (
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 gap-1 px-2.5 sm:pl-2.5 pointer-events-none opacity-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 18l-6-6 6-6"
                />
              </svg>
              <span className="hidden sm:block">Previous</span>
            </span>
          ) : (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 gap-1 px-2.5 sm:pl-2.5"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 18l-6-6 6-6"
                />
              </svg>
              <span className="hidden sm:block">Previous</span>
            </Link>
          )}
        </PaginationItem>

        {/* 첫 페이지가 1이 아니면 1과 ... 표시 */}
        {startPage > 1 && (
          <>
            <PaginationItem>
              <Link
                href={createPageUrl(1)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9"
              >
                1
              </Link>
            </PaginationItem>
            {startPage > 2 && (
              <PaginationItem>
                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium size-9">
                  ...
                </span>
              </PaginationItem>
            )}
          </>
        )}

        {/* 페이지 범위 표시 */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <PaginationItem key={page}>
            <Link
              href={createPageUrl(page)}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all ${
                currentPage === page
                  ? 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-9'
                  : 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9'
              }`}
            >
              {page}
            </Link>
          </PaginationItem>
        ))}

        {/* 마지막 페이지가 끝이 아니면 ...과 마지막 페이지 표시 */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium size-9">
                  ...
                </span>
              </PaginationItem>
            )}
            <PaginationItem>
              <Link
                href={createPageUrl(totalPages)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9"
              >
                {totalPages}
              </Link>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          {currentPage === totalPages ? (
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 gap-1 px-2.5 sm:pr-2.5 pointer-events-none opacity-50">
              <span className="hidden sm:block">Next</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 18l6-6-6-6"
                />
              </svg>
            </span>
          ) : (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 gap-1 px-2.5 sm:pr-2.5"
            >
              <span className="hidden sm:block">Next</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 18l6-6-6-6"
                />
              </svg>
            </Link>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
