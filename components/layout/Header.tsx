/**
 * Header 컴포넌트
 * @author Minseok kim
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header
      role="banner"
      className="flex justify-between items-center px-4 py-3 bg-white shadow-sm border-b"
    >
      {/* 로고 */}
      <div className="flex items-center">
        <Image src="/logo.png" alt="Curatify 로고" width={120} height={40} className="h-8 w-auto" />
      </div>

      {/* 데스크톱 메뉴 */}
      <div className="hidden md:block">
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
          로그인/회원가입
        </Button>
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
            <SheetDescription className="text-sm text-gray-600">
              AI 기반 연구 정보 큐레이션
            </SheetDescription>
            <div className="flex flex-col space-y-4 mt-2">
              <hr />
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(false)}
              >
                로그인/회원가입
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
