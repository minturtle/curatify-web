'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { addUserInterestAction, ActionState } from '@/lib/profile/actions';
import { useActionState } from 'react';

export default function AddInterestForm() {
  const [content, setContent] = useState('');
  const [state, action] = useActionState<ActionState, FormData>(addUserInterestAction, {});

  // 성공 시 입력 필드 초기화
  if (state.success && content.trim()) {
    setContent('');
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">새 관심사 추가</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="관심사 내용을 입력하세요"
              className="flex-1"
              maxLength={100}
            />
            <input type="hidden" name="content" value={content} />
            <Button type="submit" disabled={!content.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              추가
            </Button>
          </div>

          {state.message && (
            <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
              {state.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
