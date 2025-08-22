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
    render(<Header isLoggedIn={false} />);

    const logo = screen.getByAltText('Curatify 로고');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('logo.png'));
  });

  it('모바일에서 햄버거 버튼이 렌더링되어야 한다', () => {
    // 모바일 뷰포트 설정
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<Header isLoggedIn={false} />);

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

    render(<Header isLoggedIn={false} />);

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
    render(<Header isLoggedIn={false} />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex', 'justify-between', 'items-center');
  });

  describe('로그인 상태에 따른 UI 변경', () => {
    it('비로그인 상태에서는 네비게이션 메뉴가 보이지 않아야 한다', () => {
      // 데스크톱 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<Header isLoggedIn={false} />);

      // 네비게이션 메뉴들이 보이지 않아야 함
      expect(screen.queryByText('라이브러리')).not.toBeInTheDocument();
      expect(screen.queryByText('산업 동향')).not.toBeInTheDocument();
      expect(screen.queryByText('RSS')).not.toBeInTheDocument();

      // 로그인/회원가입 버튼은 보여야 함
      expect(screen.getByRole('button', { name: /로그인\/회원가입/i })).toBeInTheDocument();
    });

    it('로그인 상태에서는 네비게이션 메뉴가 보여야 한다', () => {
      // 데스크톱 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<Header isLoggedIn={true} />);

      // 네비게이션 메뉴들이 보여야 함
      expect(screen.getByText('라이브러리')).toBeInTheDocument();
      expect(screen.getByText('산업 동향')).toBeInTheDocument();
      expect(screen.getByText('RSS')).toBeInTheDocument();

      // 로그인/회원가입 버튼은 보이지 않아야 함
      expect(screen.queryByRole('button', { name: /로그인\/회원가입/i })).not.toBeInTheDocument();
    });

    it('로그인 상태에서는 사용자 아바타가 보여야 한다', () => {
      // 데스크톱 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<Header isLoggedIn={true} />);

      // 사용자 아바타가 보여야 함
      const userAvatar = screen.getByTestId('user-avatar');
      expect(userAvatar).toBeInTheDocument();
    });

    it('사용자 아바타 클릭 시 마이페이지로 이동해야 한다', async () => {
      const user = userEvent.setup();

      // 데스크톱 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<Header isLoggedIn={true} />);

      const userAvatar = screen.getByTestId('user-avatar');
      expect(userAvatar).toBeInTheDocument();

      // 아바타 클릭 시 마이페이지 링크로 이동
      await user.click(userAvatar);

      // 링크가 마이페이지로 설정되어 있는지 확인
      expect(userAvatar.closest('a')).toHaveAttribute('href', '/mypage');
    });

    it('모바일에서 비로그인 상태일 때 사이드바에 네비게이션 메뉴가 보이지 않아야 한다', async () => {
      const user = userEvent.setup();

      // 모바일 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<Header isLoggedIn={false} />);

      const hamburgerButton = screen.getByRole('button', { name: /메뉴/i });
      await user.click(hamburgerButton);

      const sidebar = screen.getByTestId('sidebar');

      // 네비게이션 메뉴들이 보이지 않아야 함
      expect(sidebar).not.toHaveTextContent('라이브러리');
      expect(sidebar).not.toHaveTextContent('산업 동향');
      expect(sidebar).not.toHaveTextContent('RSS');

      // 로그인/회원가입 버튼은 보여야 함
      expect(sidebar).toHaveTextContent('로그인/회원가입');
    });

    it('모바일에서 로그인 상태일 때 사이드바에 네비게이션 메뉴가 보여야 한다', async () => {
      const user = userEvent.setup();

      // 모바일 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<Header isLoggedIn={true} />);

      const hamburgerButton = screen.getByRole('button', { name: /메뉴/i });
      await user.click(hamburgerButton);

      const sidebar = screen.getByTestId('sidebar');

      // 네비게이션 메뉴들이 보여야 함
      expect(sidebar).toHaveTextContent('라이브러리');
      expect(sidebar).toHaveTextContent('산업 동향');
      expect(sidebar).toHaveTextContent('RSS');

      // 로그인/회원가입 버튼은 보이지 않아야 함
      expect(sidebar).not.toHaveTextContent('로그인/회원가입');
    });
  });
});
