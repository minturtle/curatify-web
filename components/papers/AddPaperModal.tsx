'use client';

import React, { useState, useTransition } from 'react';
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
  const [result, setResult] = useState<RegisterPaperActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paperId.trim()) {
      setResult({
        success: false,
        error: 'ArXiv ID를 입력해주세요.',
      });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('paperId', paperId.trim());
      
      const actionResult = await registerPaperForAnalysis(
        { success: false },
        formData
      );
      
      setResult(actionResult);
      
      if (actionResult.success) {
        setPaperId('');
        setOpen(false);
        onSuccess?.();
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setResult(null);
      setPaperId('');
    }
  };

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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="paperId" className="text-sm font-medium">
              ArXiv ID
            </label>
            <Input
              id="paperId"
              type="text"
              placeholder="예: 2301.00001 또는 2301.00001v1"
              value={paperId}
              onChange={(e) => setPaperId(e.target.value)}
              disabled={isPending}
              className={result?.success === false ? 'border-destructive' : ''}
            />
            {result?.error && (
              <p className="text-sm text-destructive">{result.error}</p>
            )}
            {result?.success && (
              <p className="text-sm text-green-600">{result.message}</p>
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
