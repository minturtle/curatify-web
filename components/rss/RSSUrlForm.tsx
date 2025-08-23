/**
 * RSS URL 등록 폼 컴포넌트
 * @author Minseok kim
 */

'use client';

import { useActionState } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addRSSUrlAction } from '@/lib/rss/actions';
import { RSSType, AddRSSUrlActionResult } from '@/lib/types/rss';

export default function RSSUrlForm() {
  const [state, formAction, pending] = useActionState<AddRSSUrlActionResult, FormData>(addRSSUrlAction, null);
  const [rssType, setRssType] = useState<RSSType>('rss');

  useEffect(() => {
    if (state?.success) {
      alert('RSS URL이 성공적으로 등록되었습니다!');
      // 폼 제출 성공 시 상태 초기화
      setRssType('rss');
    } else if (state?.error) {
      alert(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto space-y-4 flex gap-2">
      <Select
        name="type"
        value={rssType}
        onValueChange={(value) => setRssType(value as RSSType)}
        required
        disabled={pending}
      >
        <SelectTrigger>
          <SelectValue placeholder="RSS 타입을 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rss">일반 RSS</SelectItem>
          <SelectItem value="youtube">YouTube</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="url"
        name="url"
        placeholder="RSS URL을 입력하세요 (예: https://example.com/rss)"
        required
        className="flex-1 w-full"
        disabled={pending}
      />
      <Button type="submit" className="px-6" disabled={pending}>
        {pending ? '등록 중...' : '등록'}
      </Button>
    </form>
  );
}
