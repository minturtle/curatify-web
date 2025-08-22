/**
 * RSS 관련 Server Actions
 * @author Minseok kim
 */

'use server';

import { addRSSUrl } from '@/lib/services/rssService';
import { revalidatePath } from 'next/cache';

/**
 * RSS URL 등록 Server Action
 */
export async function addRSSUrlAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const url = formData.get('url') as string;

  if (!url) {
    return { error: 'RSS URL을 입력해주세요.' };
  }

  try {
    await addRSSUrl({ url });
    revalidatePath('/rss');
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'RSS URL 등록에 실패했습니다.' };
  }
}
