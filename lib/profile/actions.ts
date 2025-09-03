'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  findUserInterests,
  addUserInterest,
  updateUserInterest,
  removeUserInterest,
} from './userProfileService';
import {
  UserInterestsType,
  AddInterestSchema,
  UpdateInterestSchema,
  RemoveInterestSchema,
} from '@/lib/types/user';

// 상태 타입 정의
export type ActionState = {
  success?: boolean;
  message?: string;
  data?: UserInterestsType[] | UserInterestsType;
  errors?: Record<string, string[]>;
};

/**
 * 사용자 관심사 목록을 조회하는 Server Action
 *
 * @returns {Promise<ActionState>} 조회 결과 상태
 */
export async function getUserInterestsAction(): Promise<ActionState> {
  try {
    const interests = await findUserInterests();

    return {
      success: true,
      data: interests,
      message: '관심사 목록을 성공적으로 조회했습니다',
    };
  } catch (error) {
    console.error('관심사 조회 중 오류:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : '관심사 조회에 실패했습니다',
    };
  }
}

/**
 * 사용자 관심사를 추가하는 Server Action
 *
 * @param {unknown} prevState - 이전 상태 (useActionState에서 전달)
 * @param {FormData} formData - 폼 데이터
 * @returns {Promise<ActionState>} 추가 결과 상태
 */
export async function addUserInterestAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 폼 데이터에서 content 추출
    const content = formData.get('content') as string;

    // 입력 데이터 검증
    const validatedFields = AddInterestSchema.safeParse({ content });

    if (!validatedFields.success) {
      const errorMessage =
        validatedFields.error.issues[0]?.message || '입력 데이터가 유효하지 않습니다';
      return {
        success: false,
        message: errorMessage,
      };
    }

    const { content: validatedContent } = validatedFields.data;

    // 관심사 추가
    const newInterest = await addUserInterest(validatedContent);

    // 캐시 무효화 (프로필 페이지 재검증)
    revalidatePath('/profile');

    return {
      success: true,
      data: newInterest,
      message: '관심사가 성공적으로 추가되었습니다',
    };
  } catch (error) {
    console.error('관심사 추가 중 오류:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : '관심사 추가에 실패했습니다',
    };
  }
}

/**
 * 사용자 관심사를 수정하는 Server Action
 *
 * @param {unknown} prevState - 이전 상태 (useActionState에서 전달)
 * @param {FormData} formData - 폼 데이터
 * @returns {Promise<ActionState>} 수정 결과 상태
 */
export async function updateUserInterestAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 폼 데이터에서 값 추출
    const interestsId = formData.get('interestsId') as string;
    const content = formData.get('content') as string;

    // 입력 데이터 검증
    const validatedFields = UpdateInterestSchema.safeParse({ interestsId, content });

    if (!validatedFields.success) {
      const errorMessage =
        validatedFields.error.issues[0]?.message || '입력 데이터가 유효하지 않습니다';
      return {
        success: false,
        message: errorMessage,
      };
    }

    const { interestsId: validatedInterestsId, content: validatedContent } = validatedFields.data;

    // 관심사 수정
    const updatedInterest = await updateUserInterest(validatedInterestsId, validatedContent);

    // 캐시 무효화 (프로필 페이지 재검증)
    revalidatePath('/profile');

    return {
      success: true,
      data: updatedInterest,
      message: '관심사가 성공적으로 수정되었습니다',
    };
  } catch (error) {
    console.error('관심사 수정 중 오류:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : '관심사 수정에 실패했습니다',
    };
  }
}

/**
 * 사용자 관심사를 제거하는 Server Action
 *
 * @param {unknown} prevState - 이전 상태 (useActionState에서 전달)
 * @param {FormData} formData - 폼 데이터
 * @returns {Promise<ActionState>} 제거 결과 상태
 */
export async function removeUserInterestAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 폼 데이터에서 interestsId 추출
    const interestsId = formData.get('interestsId') as string;

    // 입력 데이터 검증
    const validatedFields = RemoveInterestSchema.safeParse({ interestsId });

    if (!validatedFields.success) {
      const errorMessage =
        validatedFields.error.issues[0]?.message || '입력 데이터가 유효하지 않습니다';
      return {
        success: false,
        message: errorMessage,
      };
    }

    const { interestsId: validatedInterestsId } = validatedFields.data;

    // 관심사 제거
    await removeUserInterest(validatedInterestsId);

    // 캐시 무효화 (프로필 페이지 재검증)
    revalidatePath('/profile');

    return {
      success: true,
      message: '관심사가 성공적으로 제거되었습니다',
    };
  } catch (error) {
    console.error('관심사 제거 중 오류:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : '관심사 제거에 실패했습니다',
    };
  }
}

/**
 * 사용자 관심사를 추가하는 Server Action (JSON 데이터 버전)
 *
 * @param {unknown} prevState - 이전 상태 (useActionState에서 전달)
 * @param {string} content - 관심사 내용
 * @returns {Promise<ActionState>} 추가 결과 상태
 */
export async function addUserInterestJsonAction(
  prevState: ActionState,
  content: string
): Promise<ActionState> {
  try {
    // 입력 데이터 검증
    const validatedFields = AddInterestSchema.safeParse({ content });

    if (!validatedFields.success) {
      const errorMessage =
        validatedFields.error.issues[0]?.message || '입력 데이터가 유효하지 않습니다';
      return {
        success: false,
        message: errorMessage,
      };
    }

    const { content: validatedContent } = validatedFields.data;

    // 관심사 추가
    const newInterest = await addUserInterest(validatedContent);

    // 캐시 무효화 (프로필 페이지 재검증)
    revalidatePath('/profile');

    return {
      success: true,
      data: newInterest,
      message: '관심사가 성공적으로 추가되었습니다',
    };
  } catch (error) {
    console.error('관심사 추가 중 오류:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : '관심사 추가에 실패했습니다',
    };
  }
}

/**
 * 사용자 관심사를 제거하는 Server Action (JSON 데이터 버전)
 *
 * @param {unknown} prevState - 이전 상태 (useActionState에서 전달)
 * @param {number} interestsId - 관심사 ID
 * @returns {Promise<ActionState>} 제거 결과 상태
 */
export async function removeUserInterestJsonAction(
  prevState: ActionState,
  interestsId: string
): Promise<ActionState> {
  try {
    // 입력 데이터 검증
    const validatedFields = RemoveInterestSchema.safeParse({ interestsId });

    if (!validatedFields.success) {
      const errorMessage =
        validatedFields.error.issues[0]?.message || '입력 데이터가 유효하지 않습니다';
      return {
        success: false,
        message: errorMessage,
      };
    }

    const { interestsId: validatedInterestsId } = validatedFields.data;

    // 관심사 제거
    await removeUserInterest(validatedInterestsId);

    // 캐시 무효화 (프로필 페이지 재검증)
    revalidatePath('/profile');

    return {
      success: true,
      message: '관심사가 성공적으로 제거되었습니다',
    };
  } catch (error) {
    console.error('관심사 제거 중 오류:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : '관심사 제거에 실패했습니다',
    };
  }
}
