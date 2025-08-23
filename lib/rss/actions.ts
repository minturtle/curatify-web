/**
 * RSS 관련 Server Actions
 * @author Minseok kim
 */

'use server';

import { addRSSUrl } from '@/lib/rss/rssService';
import { RSSType, RSSUrlSchema, AddRSSUrlActionResult } from '@/lib/types/rss';
import { revalidatePath } from 'next/cache';

/**
 * RSS URL 등록 Server Action
 */
export async function addRSSUrlAction(
  prevState: AddRSSUrlActionResult,
  formData: FormData
): Promise<AddRSSUrlActionResult> {
  // FormData에서 데이터 추출
  const url = formData.get('url') as string;
  const type = formData.get('type') as RSSType;

  // Zod를 사용한 서버 측 검증
  const validatedFields = RSSUrlSchema.safeParse({
    url,
    type,
  });

  // 검증 실패 시 오류 반환
  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.issues[0]?.message || '입력 데이터가 유효하지 않습니다.',
    };
  }

  const { url: validatedUrl, type: validatedType } = validatedFields.data;

  try {
    await addRSSUrl({ url: validatedUrl, type: validatedType });
    revalidatePath('/rss');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'RSS URL 등록에 실패했습니다.',
    };
  }
}
