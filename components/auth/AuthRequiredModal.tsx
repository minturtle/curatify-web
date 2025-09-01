'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AuthRequiredModalProps {
  redirectTo: string;
}

export function AuthRequiredModal({ redirectTo }: AuthRequiredModalProps) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleRedirect = () => {
    setOpen(false);
    router.push(redirectTo);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-5 w-5 text-blue-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            로그인이 필요합니다
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <p className="text-gray-700 mb-2">이 페이지에 접근하려면 로그인이 필요합니다.</p>
            <p className="text-sm text-gray-500">로그인 페이지로 이동하여 인증을 완료해주세요.</p>
          </div>
          
          <div className="pt-2">
            <button
              onClick={handleRedirect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}