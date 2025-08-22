/**
 * RSS URL 등록 폼 컴포넌트 테스트
 * @author Minseok kim
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RSSUrlForm from '@/components/rss/RSSUrlForm';

// Server Action 모킹
vi.mock('@/app/rss/actions', () => ({
  addRSSUrlAction: vi.fn(),
}));

describe('RSSUrlForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('폼이 Server Action을 사용한다', () => {
    const { container } = render(<RSSUrlForm />);

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('action');
  });

  it('URL 입력 필드가 required 속성을 가진다', () => {
    render(<RSSUrlForm />);

    const input = screen.getByPlaceholderText(/RSS URL을 입력하세요/);
    expect(input).toHaveAttribute('required');
  });
});
