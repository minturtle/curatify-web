'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { logoutAction } from '@/lib/auth/actions';

interface ApprovalRequiredModalProps {
  userName?: string;
}

export function ApprovalRequiredModal({ userName }: ApprovalRequiredModalProps) {
  const [open, setOpen] = useState(true);

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/auth';
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-5 w-5 text-yellow-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            관리자 승인 대기 중
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <p className="text-gray-700 mb-2">
              {userName ? `${userName}님, ` : ''}관리자 승인을 기다려주세요.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              승인이 완료될 때까지 서비스 이용이 제한됩니다.
            </p>
            <p className="text-sm text-gray-500">
              승인 관련 문의가 있으시면 관리자에게 연락해주세요.
            </p>
          </div>
          
          <div className="pt-2 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              다른 계정으로 로그인
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}