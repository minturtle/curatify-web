'use client';

import React, { useState, useActionState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerPaperForAnalysis } from '@/lib/paper/actions';
import { RegisterPaperActionResult } from '@/lib/types/paper';
import { PlusIcon, Loader2Icon } from 'lucide-react';

interface AddPaperModalProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export default function AddPaperModal({ children, onSuccess }: AddPaperModalProps) {
  const [open, setOpen] = useState(false);
  const [paperId, setPaperId] = useState('');
  
  // useActionState를 사용하여 서버 액션 상태 관리
  const [state, formAction, isPending] = useActionState<RegisterPaperActionResult, FormData>(
    registerPaperForAnalysis,
    { success: false }
  );


  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setPaperId('');
    }
  };

  // 성공 시 모달 닫기 및 콜백 실행
  React.useEffect(() => {
    if (state.success) {
      setPaperId('');
      setOpen(false);
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button className="cursor-pointer">
            <PlusIcon className="h-4 w-4" />
            논문 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>논문 초록 분석 등록</DialogTitle>
          <DialogDescription>
            ArXiv ID를 입력하세요.
          </DialogDescription>
        </DialogHeader>
        
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="paperId" className="text-sm font-medium">
              ArXiv ID
            </label>
            <Input
              id="paperId"
              name="paperId"
              type="text"
              placeholder="예: 2301.00001 또는 2301.00001v1"
              value={paperId}
              onChange={(e) => {
                const normalized = e.target.value.toLowerCase();
                setPaperId(normalized);
              }}
              disabled={isPending}
              className={state?.success === false ? 'border-destructive' : ''}
              required
              pattern="\d{4}\.\d{5}(v\d+)?"
              title="예: 2301.00001 또는 2301.00001v1"
            />
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            {state?.success && (
              <p className="text-sm text-green-600">{state.message}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2Icon className="h-4 w-4 animate-spin" />}
              {isPending ? '등록 중...' : '등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
