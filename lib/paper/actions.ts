'use server';

import { registerPaper, registerPaperAbstract } from './paperService';
import { RegisterPaperSchema, RegisterPaperActionResult } from '@/lib/types/paper';
import { revalidatePath } from 'next/cache';

/**
 * 논문 심층 분석 등록을 위한 Server Action
 *
 * @param {RegisterPaperActionResult} prevState - 이전 상태
 * @param {FormData} formData - 폼 데이터
 * @returns {Promise<RegisterPaperActionResult>} 등록 결과
 */
export async function registerPaperForAnalysis(
  prevState: RegisterPaperActionResult,
  formData: FormData
): Promise<RegisterPaperActionResult> {
  // FormData에서 데이터 추출
  const paperId = formData.get('paperId') as string;
  // Zod를 사용한 서버 측 검증
  const validatedFields = RegisterPaperSchema.safeParse({
    paperId,
  });

  // 검증 실패 시 오류 반환
  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.issues[0]?.message || '입력 데이터가 유효하지 않습니다.',
    };
  }

  const { paperId: validatedPaperId } = validatedFields.data;

  try {
    // 논문 등록 실행
    const result = await registerPaperAbstract(validatedPaperId);
    if (result) {
      revalidatePath('/');
      return {
        success: true,
        message: '논문 초록 분석이 성공적으로 등록되었습니다.',
      };
    }

    return {
      success: false,
      error: '논문 등록에 실패했습니다. 논문을 찾을 수 없거나 처리 중 오류가 발생했습니다.',
    };
  } catch (error) {
    console.error('논문 심층 분석 등록 중 오류 발생:', error);
    return {
      success: false,
      error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}
