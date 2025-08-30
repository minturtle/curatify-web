'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/auth/actions';

export default function LogoutButton() {
  const handleLogout = async () => {
    if (confirm('정말로 로그아웃하시겠습니까?')) {
      await logoutAction();
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="w-full">
      <LogOut className="h-4 w-4 mr-2" />
      로그아웃
    </Button>
  );
}
