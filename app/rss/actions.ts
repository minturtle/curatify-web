/**
 * RSS 관련 Server Actions
 * @author Minseok kim
 */

'use server';

import { addRSSUrl } from '@/lib/services/rssService';
import { RSSType } from '@/lib/types/rss';
import { revalidatePath } from 'next/cache';

/**
 * RSS URL 등록 Server Action
 */
export async function addRSSUrlAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const url = formData.get('url') as string;
  const type = formData.get('type') as RSSType;

  if (!url) {
    return { error: 'RSS URL을 입력해주세요.' };
  }

  if (!type) {
    return { error: 'RSS 타입을 선택해주세요.' };
  }

  try {
    await addRSSUrl({ url, type });
    revalidatePath('/rss');
    return { success: true };
  } catch (error) {
    return {
      sucess: false,
      error: error instanceof Error ? error.message : 'RSS URL 등록에 실패했습니다.',
    };
  }
}
