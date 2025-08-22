/**
 * Header 컴포넌트 테스트
 * @author Minseok kim
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils';
import userEvent from '@testing-library/user-event';
import Header from '@/components/layout/Header';

describe('Header 컴포넌트', () => {
  it('로고 이미지가 렌더링되어야 한다', () => {
    render(<Header />);

    const logo = screen.getByAltText('Curatify 로고');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('logo.png'));
  });

  it('데스크톱에서 파란색 로그인/회원가입 버튼이 렌더링되어야 한다', () => {
    // 데스크톱 뷰포트 설정
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    render(<Header />);

    const authButton = screen.getByRole('button', { name: /로그인\/회원가입/i });
    expect(authButton).toBeInTheDocument();
    expect(authButton).toHaveClass('bg-blue-600');
  });

  it('모바일에서 햄버거 버튼이 렌더링되어야 한다', () => {
    // 모바일 뷰포트 설정
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<Header />);

    const hamburgerButton = screen.getByRole('button', { name: /메뉴/i });
    expect(hamburgerButton).toBeInTheDocument();
  });

  it('햄버거 버튼 클릭 시 Sidebar가 나타나야 한다', async () => {
    const user = userEvent.setup();

    // 모바일 뷰포트 설정
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<Header />);

    const hamburgerButton = screen.getByRole('button', { name: /메뉴/i });

    // 초기에는 Sidebar가 숨겨져 있어야 함
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();

    // 햄버거 버튼 클릭
    await user.click(hamburgerButton);

    // Sidebar가 나타나야 함
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveTextContent('로그인/회원가입');
  });

  it('헤더가 반응형으로 동작해야 한다', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex', 'justify-between', 'items-center');
  });
});
