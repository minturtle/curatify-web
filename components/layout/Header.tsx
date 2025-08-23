/**
 * Header 컴포넌트
 * @author Minseok kim
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Menu, User, LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/auth/actions';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        setIsLoggedIn(data.isAuthenticated);
      } catch (error) {
        console.error('Auth status check failed:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const result = await logoutAction();
      if (result.success) {
        setIsLoggedIn(false);
        router.push('/');
        router.refresh();
      } else {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <header className="flex justify-between items-center px-4 py-3 bg-white shadow-sm border-b">
        <div className="flex items-center">
          <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header
      role="banner"
      className="flex justify-between items-center px-4 py-3 bg-white shadow-sm border-b"
    >
      {/* 로고 */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Curatify 로고"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      {/* 데스크톱 네비게이션 */}
      {isLoggedIn && (
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/library"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            라이브러리
          </Link>
          <Link
            href="/trends"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            산업 동향
          </Link>
          <Link
            href="/rss"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            RSS
          </Link>
        </nav>
      )}

      {/* 데스크톱 우측 영역 */}
      <div className="hidden md:flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link href="/mypage" className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <User className="w-6 h-6" data-testid="user-avatar" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </>
        ) : (
          <Link href="/auth">
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
              로그인/회원가입
            </Button>
          </Link>
        )}
      </div>

      {/* 모바일 햄버거 버튼 & Sidebar */}
      <div className="md:hidden">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 text-gray-700 hover:text-gray-900"
              aria-label="메뉴"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-6" data-testid="sidebar">
            <SheetTitle className="text-lg font-semibold text-gray-900 mb-2">메뉴</SheetTitle>
            <SheetDescription className="text-sm text-gray-600 mb-4">
              AI 기반 연구 정보 큐레이션
            </SheetDescription>
            <div className="flex flex-col space-y-4 mt-2">
              <hr />
              {isLoggedIn ? (
                <>
                  <Link
                    href="/library"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    라이브러리
                  </Link>
                  <Link
                    href="/trends"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    산업 동향
                  </Link>
                  <Link
                    href="/rss"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    RSS
                  </Link>
                  <hr />
                  <Link
                    href="/mypage"
                    className="flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <User className="w-5 h-5 mr-2" />
                    마이페이지
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => {
                      handleLogout();
                      setIsSidebarOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    로그인/회원가입
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
