/**
 * RSS URL 등록 폼 컴포넌트
 * @author Minseok kim
 */

'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { addRSSUrlAction } from '@/app/rss/actions';

export default function RSSUrlForm() {
  const [state, formAction] = useFormState(addRSSUrlAction, null);

  useEffect(() => {
    if (state?.success) {
      alert('RSS URL이 성공적으로 등록되었습니다!');
    }
  }, [state]);

  return (
    <form action={formAction} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          type="url"
          name="url"
          placeholder="RSS URL을 입력하세요 (예: https://example.com/rss)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <Button type="submit" className="px-6">
          등록
        </Button>
      </div>
    </form>
  );
}
