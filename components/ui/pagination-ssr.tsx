/**
 * SSR 전용 페이지네이션 컴포넌트
 * @author Minseok kim
 */

import React from 'react';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import Link from 'next/link';

interface PaginationSSRProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationSSR({ currentPage, totalPages }: PaginationSSRProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    return `?page=${page}`;
  };

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

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
