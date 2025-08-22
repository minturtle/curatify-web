/**
 * PaginationSSR 컴포넌트 테스트
 * @author Minseok kim
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils';
import PaginationSSR from '@/components/ui/pagination-ssr';

describe('PaginationSSR 컴포넌트', () => {
  it('총 페이지가 1 이하일 때는 렌더링되지 않아야 한다', () => {
    const { container } = render(<PaginationSSR currentPage={1} totalPages={1} />);

    expect(container.firstChild).toBeNull();
  });

  it('현재 페이지가 활성화되어야 한다', () => {
    render(<PaginationSSR currentPage={2} totalPages={3} />);

    const activePage = screen.getByText('2');
    expect(activePage).toHaveClass('border', 'bg-background', 'shadow-xs');
  });

  it('페이지 링크가 올바른 URL을 가져야 한다', () => {
    render(<PaginationSSR currentPage={1} totalPages={3} />);

    const page2Link = screen.getByText('2').closest('a');
    expect(page2Link).toHaveAttribute('href', '?page=2');
  });

  it('첫 페이지에서 이전 버튼이 비활성화되어야 한다', () => {
    render(<PaginationSSR currentPage={1} totalPages={3} />);

    const previousButton = screen.getByText('Previous');
    const parentSpan = previousButton.parentElement;
    expect(parentSpan).toHaveClass('pointer-events-none', 'opacity-50');
  });

  it('마지막 페이지에서 다음 버튼이 비활성화되어야 한다', () => {
    render(<PaginationSSR currentPage={3} totalPages={3} />);

    const nextButton = screen.getByText('Next');
    const parentSpan = nextButton.parentElement;
    expect(parentSpan).toHaveClass('pointer-events-none', 'opacity-50');
  });
});
