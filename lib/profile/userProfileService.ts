import { UserInterestsType, UserInterestsSchema } from '@/lib/types/user';
import { ensureDatabaseConnection } from '@/lib/database/connection';
import { getUserRepository, getUserInterestsRepository } from '@/lib/database/repositories';
import { getSession } from '@/lib/auth/session';

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
    // 세션에서 사용자 ID 가져오기
    const session = await getSession();
    if (!session) {
      throw new Error('로그인이 필요합니다');
    }

    await ensureDatabaseConnection();
    const userRepository = getUserRepository();

    // 사용자와 관심사를 함께 조회
    const user = await userRepository.findOne({
      where: { id: session.userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }

    // UserInterestsType 형태로 변환하여 반환
    const interests = await user.interests;
    return interests.map((interest) => ({
      interestsId: interest.id,
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
    // 세션에서 사용자 ID 가져오기
    const session = await getSession();
    if (!session) {
      throw new Error('로그인이 필요합니다');
    }

    // 입력 데이터 검증
    const validatedData = UserInterestsSchema.parse({
      userId: session.userId,
      content,
    });

    await ensureDatabaseConnection();
    const userRepository = getUserRepository();

    // 사용자 존재 확인
    const user = await userRepository.findOne({ where: { id: session.userId } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }

    // 새로운 관심사 생성
    const interestRepository = getUserInterestsRepository();
    const newInterest = interestRepository.create({
      userId: validatedData.userId,
      content: validatedData.content,
    });

    // 데이터베이스에 저장
    const savedInterest = await interestRepository.save(newInterest);

    // UserInterestsType 형태로 반환
    return {
      interestsId: savedInterest.id,
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
 * @param {number} interestsId - 수정할 관심사의 ID
 * @param {string} content - 새로운 관심사 내용
 * @returns {Promise<UserInterestsType>} 수정된 관심사 정보
 * @description 현재 세션의 사용자 ID를 사용하여 기존 관심사를 수정합니다.
 *
 * @example
 * ```typescript
 * const updatedInterest = await updateUserInterest(1, '머신러닝')
 * console.log(`관심사 수정됨: ${updatedInterest.content}`)
 * ```
 */
export async function updateUserInterest(
  interestsId: number,
  content: string
): Promise<UserInterestsType> {
  try {
    // 세션에서 사용자 ID 가져오기
    const session = await getSession();
    if (!session) {
      throw new Error('로그인이 필요합니다');
    }

    // 입력 데이터 검증
    const validatedData = UserInterestsSchema.parse({
      userId: session.userId,
      content,
    });

    await ensureDatabaseConnection();
    const userRepository = getUserRepository();

    // 사용자 존재 확인
    const user = await userRepository.findOne({ where: { id: session.userId } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }

    // 관심사 존재 확인 및 소유권 확인
    const interestRepository = getUserInterestsRepository();
    const existingInterest = await interestRepository.findOne({
      where: { id: interestsId, userId: session.userId },
    });

    if (!existingInterest) {
      throw new Error('관심사를 찾을 수 없습니다');
    }

    // 관심사 수정
    existingInterest.content = validatedData.content;
    const updatedInterest = await interestRepository.save(existingInterest);

    // UserInterestsType 형태로 반환
    return {
      interestsId: updatedInterest.id,
      content: updatedInterest.content,
    };
  } catch (error) {
    console.error('사용자 관심사 수정 중 오류 발생:', error);
    if (
      error instanceof Error &&
      (error.message === '사용자를 찾을 수 없습니다' ||
        error.message === '로그인이 필요합니다' ||
        error.message === '관심사를 찾을 수 없습니다')
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
 * @param {number} interestsId - 제거할 관심사의 ID
 * @returns {Promise<void>} 제거 완료를 의미하는 Promise
 * @description 현재 세션의 사용자 ID를 사용하여 기존 관심사를 제거합니다.
 *
 * @example
 * ```typescript
 * await removeUserInterest(1)
 * console.log('관심사가 제거되었습니다')
 * ```
 */
export async function removeUserInterest(interestsId: number): Promise<void> {
  try {
    // 세션에서 사용자 ID 가져오기
    const session = await getSession();
    if (!session) {
      throw new Error('로그인이 필요합니다');
    }

    await ensureDatabaseConnection();
    const userRepository = getUserRepository();

    // 사용자 존재 확인
    const user = await userRepository.findOne({ where: { id: session.userId } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }

    // 관심사 존재 확인 및 소유권 확인
    const interestRepository = getUserInterestsRepository();
    const existingInterest = await interestRepository.findOne({
      where: { id: interestsId, userId: session.userId },
    });

    if (!existingInterest) {
      throw new Error('관심사를 찾을 수 없습니다');
    }

    // 관심사 제거
    await interestRepository.remove(existingInterest);
  } catch (error) {
    console.error('사용자 관심사 제거 중 오류 발생:', error);
    if (
      error instanceof Error &&
      (error.message === '사용자를 찾을 수 없습니다' ||
        error.message === '로그인이 필요합니다' ||
        error.message === '관심사를 찾을 수 없습니다')
    ) {
      throw error;
    }
    throw new Error('사용자 관심사 제거에 실패했습니다');
  }
}
