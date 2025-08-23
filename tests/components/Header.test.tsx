/**
 * Header 컴포넌트 테스트
 * @author Minseok kim
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '../utils';
import userEvent from '@testing-library/user-event';
import Header from '@/components/layout/Header';

// Mock Next.js router
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => '/',
}));



describe('Header 컴포넌트', () => {
  // Mock fetch API
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockClear();
    mockPush.mockClear();
    mockRefresh.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('모바일에서 햄버거 버튼이 렌더링되어야 한다', async () => {
    // Mock auth status API response
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ isAuthenticated: false }),
    });

    // 모바일 뷰포트 설정
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<Header />);

    // Wait for auth status to load
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/status');
    });

    const hamburgerButton = screen.getByRole('button', { name: /메뉴/i });
    expect(hamburgerButton).toBeInTheDocument();
  });

  it('햄버거 버튼 클릭 시 Sidebar가 나타나야 한다', async () => {
    const user = userEvent.setup();

    // Mock auth status API response
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ isAuthenticated: false }),
    });

    // 모바일 뷰포트 설정
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<Header />);

    // Wait for auth status to load
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/status');
    });

    const hamburgerButton = screen.getByRole('button', { name: /메뉴/i });

    // 초기에는 Sidebar가 숨겨져 있어야 함
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();

    // 햄버거 버튼 클릭
    await user.click(hamburgerButton);

    // Sidebar가 나타나야 함
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
  });

  it('헤더가 반응형으로 동작해야 한다', async () => {
    // Mock auth status API response
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ isAuthenticated: false }),
    });

    render(<Header />);

    // Wait for auth status to load
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/status');
    });

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex', 'justify-between', 'items-center');
  });

  describe('로그인 상태에 따른 UI 변경', () => {
    it('비로그인 상태에서는 네비게이션 메뉴가 보이지 않아야 한다', async () => {
      // Mock auth status API response
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ isAuthenticated: false }),
      });

      // 데스크톱 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<Header />);

      // Wait for auth status to load
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/status');
      });

      // 네비게이션 메뉴들이 보이지 않아야 함
      expect(screen.queryByText('라이브러리')).not.toBeInTheDocument();
      expect(screen.queryByText('산업 동향')).not.toBeInTheDocument();
      expect(screen.queryByText('RSS')).not.toBeInTheDocument();

      // 로그인/회원가입 버튼은 보여야 함
      expect(screen.getByText('로그인/회원가입')).toBeInTheDocument();
    });

    it('로그인 상태에서는 네비게이션 메뉴가 보여야 한다', async () => {
      // Mock auth status API response
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ isAuthenticated: true }),
      });

      // 데스크톱 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<Header />);

      // Wait for auth status to load
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/status');
      });

      // 네비게이션 메뉴들이 보여야 함
      expect(screen.getByText('라이브러리')).toBeInTheDocument();
      expect(screen.getByText('산업 동향')).toBeInTheDocument();
      expect(screen.getByText('RSS')).toBeInTheDocument();

      // 로그인/회원가입 버튼은 보이지 않아야 함
      expect(screen.queryByText('로그인/회원가입')).not.toBeInTheDocument();
    });

    it('로그인 상태에서는 사용자 아바타가 보여야 한다', async () => {
      // Mock auth status API response
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ isAuthenticated: true }),
      });

      // 데스크톱 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<Header />);

      // Wait for auth status to load
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/status');
      });

      // 사용자 아바타가 보여야 함
      const userAvatar = screen.getByTestId('user-avatar');
      expect(userAvatar).toBeInTheDocument();
    });

    it('사용자 아바타 클릭 시 마이페이지로 이동해야 한다', async () => {
      const user = userEvent.setup();

      // Mock auth status API response
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ isAuthenticated: true }),
      });

      // 데스크톱 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<Header />);

      // Wait for auth status to load
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/status');
      });

      const userAvatar = screen.getByTestId('user-avatar');
      expect(userAvatar).toBeInTheDocument();

      // 아바타 클릭 시 마이페이지 링크로 이동
      await user.click(userAvatar);

      // 링크가 마이페이지로 설정되어 있는지 확인
      expect(userAvatar.closest('a')).toHaveAttribute('href', '/mypage');
    });

    it('모바일에서 비로그인 상태일 때 사이드바에 네비게이션 메뉴가 보이지 않아야 한다', async () => {
      const user = userEvent.setup();

      // Mock auth status API response
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ isAuthenticated: false }),
      });

      // 모바일 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<Header />);

      // Wait for auth status to load
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/status');
      });

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

      // Mock auth status API response
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ isAuthenticated: true }),
      });

      // 모바일 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<Header />);

      // Wait for auth status to load
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/status');
      });

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