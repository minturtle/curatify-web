import { UserInterestsType, UserInterestsSchema } from '@/lib/types/user';
import { ensureDatabaseConnection } from '@/lib/database/connection';
import mongoose from 'mongoose';
import { UserInterests as UserInterestsModel, type IUserInterests } from '@/lib/database/entities';
import { getUserAuthStatus } from '../auth/userService';

/**
 * 현재 사용자의 관심사를 조회합니다.
 *
 * @returns {Promise<UserInterestsType[]>} 사용자의 관심사 목록
 * @description 현재 세션의 사용자 ID를 사용하여 모든 관심사를 조회합니다.
 *
 * @example
 * ```typescript
 * const interests = await findUserInterests()
 * console.log(`사용자 관심사: ${interests.map(i => i.content).join(', ')}`)
 * ```
 */
export async function findUserInterests(): Promise<UserInterestsType[]> {
  try {
    await ensureDatabaseConnection();

    const currentUser = await getUserAuthStatus();

    if (!currentUser.authenticate_status) {
      throw new Error('로그인이 필요합니다');
    }
    if (!currentUser.authorize_status) {
      throw new Error('사용자 권한이 없습니다');
    }

    // 사용자 관심사를 직접 조회
    const interests = await UserInterestsModel.find({
      userId: currentUser.user?.id,
    }).sort({ createdAt: -1 });

    // UserInterestsType 형태로 변환하여 반환
    return interests.map((interest: IUserInterests) => ({
      interestsId: (interest._id as mongoose.Types.ObjectId).toString(),
      content: interest.content,
    }));
  } catch (error) {
    console.error('사용자 관심사 조회 중 오류 발생:', error);
    if (
      error instanceof Error &&
      (error.message === '사용자를 찾을 수 없습니다' || error.message === '로그인이 필요합니다')
    ) {
      throw error;
    }
    throw new Error('사용자 관심사 조회에 실패했습니다');
  }
}

/**
 * 사용자 관심사를 추가합니다.
 *
 * @param {string} content - 추가할 관심사 내용
 * @returns {Promise<UserInterestsType>} 추가된 관심사 정보
 * @description 현재 세션의 사용자 ID를 사용하여 새로운 관심사를 추가합니다.
 *
 * @example
 * ```typescript
 * const newInterest = await addUserInterest('인공지능')
 * console.log(`관심사 추가됨: ${newInterest.content}`)
 * ```
 */
export async function addUserInterest(content: string): Promise<UserInterestsType> {
  try {
    await ensureDatabaseConnection();

    const currentUser = await getUserAuthStatus();

    if (!currentUser.authenticate_status) {
      throw new Error('로그인이 필요합니다');
    }

    if (!currentUser.authorize_status) {
      throw new Error('사용자 권한이 없습니다');
    }

    // 입력 데이터 검증
    const validatedData = UserInterestsSchema.parse({
      userId: currentUser.user?.id,
      content,
    });

    // 새로운 관심사 생성
    const newInterest = new UserInterestsModel({
      userId: validatedData.userId,
      content: validatedData.content,
    });

    // 데이터베이스에 저장
    const savedInterest = await newInterest.save();

    // UserInterestsType 형태로 반환
    return {
      interestsId: (savedInterest._id as mongoose.Types.ObjectId).toString(),
      content: savedInterest.content,
    };
  } catch (error) {
    console.error('사용자 관심사 추가 중 오류 발생:', error);
    if (
      error instanceof Error &&
      (error.message === '사용자를 찾을 수 없습니다' || error.message === '로그인이 필요합니다')
    ) {
      throw error;
    }
    // Zod 검증 오류 그대로 전달
    if (error instanceof Error && error.name === 'ZodError') {
      throw new Error(error.message);
    }
    throw new Error('사용자 관심사 추가에 실패했습니다');
  }
}

/**
 * 사용자 관심사를 수정합니다.
 *
 * @param {string} interestsId - 수정할 관심사의 ID
 * @param {string} content - 새로운 관심사 내용
 * @returns {Promise<UserInterestsType>} 수정된 관심사 정보
 * @description 현재 세션의 사용자 ID를 사용하여 기존 관심사를 수정합니다.
 *
 * @example
 * ```typescript
 * const updatedInterest = await updateUserInterest('507f1f77bcf86cd799439011', '머신러닝')
 * console.log(`관심사 수정됨: ${updatedInterest.content}`)
 * ```
 */
export async function updateUserInterest(
  interestsId: string,
  content: string
): Promise<UserInterestsType> {
  try {
    await ensureDatabaseConnection();
    const currentUser = await getUserAuthStatus();

    if (!currentUser.authenticate_status) {
      throw new Error('로그인이 필요합니다');
    }

    if (!currentUser.authorize_status) {
      throw new Error('사용자 권한이 없습니다');
    }

    // 입력 데이터 검증
    const validatedData = UserInterestsSchema.parse({
      userId: currentUser.user?.id,
      content,
    });

    // ObjectId 유효성 검사
    if (!mongoose.Types.ObjectId.isValid(interestsId)) {
      throw new Error('유효하지 않은 관심사 ID입니다');
    }

    // 관심사 존재 확인 및 소유권 확인
    const existingInterest = await UserInterestsModel.findOne({
      _id: interestsId,
      userId: currentUser.user?.id,
    });

    if (!existingInterest) {
      throw new Error('관심사를 찾을 수 없습니다');
    }

    // 관심사 수정
    existingInterest.content = validatedData.content;
    const updatedInterest = await existingInterest.save();

    // UserInterestsType 형태로 반환
    return {
      interestsId: (updatedInterest._id as mongoose.Types.ObjectId).toString(),
      content: updatedInterest.content,
    };
  } catch (error) {
    console.error('사용자 관심사 수정 중 오류 발생:', error);
    if (
      error instanceof Error &&
      (error.message === '사용자를 찾을 수 없습니다' ||
        error.message === '로그인이 필요합니다' ||
        error.message === '관심사를 찾을 수 없습니다' ||
        error.message === '유효하지 않은 관심사 ID입니다')
    ) {
      throw error;
    }
    // Zod 검증 오류 그대로 전달
    if (error instanceof Error && error.name === 'ZodError') {
      throw new Error(error.message);
    }
    throw new Error('사용자 관심사 수정에 실패했습니다');
  }
}

/**
 * 사용자 관심사를 제거합니다.
 *
 * @param {string} interestsId - 제거할 관심사의 ID
 * @returns {Promise<void>} 제거 완료를 의미하는 Promise
 * @description 현재 세션의 사용자 ID를 사용하여 기존 관심사를 제거합니다.
 *
 * @example
 * ```typescript
 * await removeUserInterest('507f1f77bcf86cd799439011')
 * console.log('관심사가 제거되었습니다')
 * ```
 */
export async function removeUserInterest(interestsId: string): Promise<void> {
  try {
    await ensureDatabaseConnection();

    const currentUser = await getUserAuthStatus();
    if (!currentUser.authenticate_status) {
      throw new Error('로그인이 필요합니다');
    }

    if (!currentUser.authorize_status) {
      throw new Error('사용자 권한이 없습니다');
    }

    // ObjectId 유효성 검사
    if (!mongoose.Types.ObjectId.isValid(interestsId)) {
      throw new Error('유효하지 않은 관심사 ID입니다');
    }

    // 관심사 존재 확인 및 소유권 확인
    const existingInterest = await UserInterestsModel.findOne({
      _id: interestsId,
      userId: currentUser.user?.id,
    });

    if (!existingInterest) {
      throw new Error('관심사를 찾을 수 없습니다');
    }

    // 관심사 제거
    await UserInterestsModel.findByIdAndDelete(interestsId);
  } catch (error) {
    console.error('사용자 관심사 제거 중 오류 발생:', error);
    if (
      error instanceof Error &&
      (error.message === '사용자를 찾을 수 없습니다' ||
        error.message === '로그인이 필요합니다' ||
        error.message === '관심사를 찾을 수 없습니다' ||
        error.message === '유효하지 않은 관심사 ID입니다')
    ) {
      throw error;
    }
    throw new Error('사용자 관심사 제거에 실패했습니다');
  }
}
