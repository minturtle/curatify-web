import { UserData, UserWithPassword } from '@/lib/types/auth';
import { UserInterestsType, UserInterestsSchema } from '@/lib/types/user';
import bcrypt from 'bcrypt';
import { ensureDatabaseConnection } from '@/lib/database/connection';
import { getUserRepository } from '@/lib/database/repositories';
import { getSession } from '@/lib/auth/session';

/**
 * 이메일 주소로 사용자를 검색합니다.
 *
 * @param {string} email - 검색할 사용자의 이메일 주소
 * @returns {Promise<UserWithPassword | null>} 찾은 사용자 정보(비밀번호 포함) 또는 null
 * @description 로그인 시 사용자 인증을 위해 비밀번호가 포함된 사용자 정보를 반환합니다.
 *
 * @example
 * ```typescript
 * const user = await findUserByEmail('user@example.com')
 * if (user) {
 *   console.log(`사용자 찾음: ${user.name}`)
 * }
 * ```
 */
export async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  try {
    await ensureDatabaseConnection();
    const userRepository = getUserRepository();
    const user = await userRepository.findOne({ where: { email } });

    if (!user) return null;

    // User 엔티티를 UserWithPassword 타입으로 변환
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      isVerified: user.isVerified,
    };
  } catch (error) {
    console.error('사용자 검색 중 오류 발생:', error);
    throw new Error('사용자 검색에 실패했습니다');
  }
}

/**
 * 사용자 ID로 사용자를 검색합니다.
 *
 * @param {string} id - 검색할 사용자의 고유 ID
 * @returns {Promise<UserData | null>} 찾은 사용자 정보(비밀번호 제외) 또는 null
 * @description 사용자 프로필 조회 등에 사용되며, 보안상 비밀번호는 제외하고 반환합니다.
 *
 * @example
 * ```typescript
 * const user = await findUserById('user-123')
 * if (user) {
 *   console.log(`사용자: ${user.name} (${user.email})`)
 * }
 * ```
 */
export async function findUserById(id: string): Promise<UserData | null> {
  try {
    await ensureDatabaseConnection();
    const userRepository = getUserRepository();
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });

    if (!user) return null;

    // 비밀번호는 제외하고 반환
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
    };
  } catch (error) {
    console.error('사용자 검색 중 오류 발생:', error);
    throw new Error('사용자 검색에 실패했습니다');
  }
}

/**
 * 새로운 사용자를 생성하고 저장합니다.
 *
 * @param {Omit<UserData, 'id'> & { password: string }} userData - 생성할 사용자 정보 (ID 제외, 비밀번호 포함)
 * @returns {Promise<UserData>} 생성된 사용자 정보 (비밀번호 제외)
 * @description 회원가입 시 새로운 사용자를 생성합니다. 데이터베이스에서 자동으로 ID를 생성합니다.
 *              반환 시에는 보안상 비밀번호를 제외합니다.
 *
 * @example
 * ```typescript
 * const newUserData = {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'hashedPassword123'
 * }
 * const user = await createUser(newUserData)
 * console.log(`새 사용자 생성: ${user.id}`)
 * ```
 */
export async function createUser(
  userData: Omit<UserData, 'id'> & { password: string }
): Promise<UserData> {
  try {
    await ensureDatabaseConnection();
    const userRepository = getUserRepository();

    // 이메일 중복 확인
    const existingUser = await userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다');
    }

    // 새 사용자 엔티티 생성
    const newUser = userRepository.create({
      email: userData.email,
      name: userData.name,
      password: userData.password, // 이미 해시된 비밀번호
      isVerified: false,
    });

    // 데이터베이스에 저장
    const savedUser = await userRepository.save(newUser);

    // 비밀번호는 제외하고 반환
    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      isVerified: savedUser.isVerified,
    };
  } catch (error) {
    console.error('사용자 생성 중 오류 발생:', error);
    if (error instanceof Error && error.message === '이미 존재하는 이메일입니다') {
      throw error;
    }
    throw new Error('사용자 생성에 실패했습니다');
  }
}

/**
 * 입력된 비밀번호와 저장된 해시 비밀번호를 비교하여 검증합니다.
 *
 * @param {string} password - 사용자가 입력한 평문 비밀번호
 * @param {string} hashedPassword - 데이터베이스에 저장된 해시된 비밀번호
 * @returns {Promise<boolean>} 비밀번호 일치 여부
 * @description 로그인 시 사용자가 입력한 비밀번호를 검증합니다.
 *              bcrypt를 사용하여 안전한 비밀번호 검증을 수행합니다.
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword('userPassword', 'hashedPassword')
 * if (isValid) {
 *   console.log('비밀번호가 일치합니다')
 * }
 * ```
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('비밀번호 검증 중 오류 발생:', error);
    return false;
  }
}

/**
 * 평문 비밀번호를 해시하여 안전하게 저장할 수 있는 형태로 변환합니다.
 *
 * @param {string} password - 해시할 평문 비밀번호
 * @returns {Promise<string>} 해시된 비밀번호
 * @description 사용자 비밀번호를 데이터베이스에 저장하기 전에 해시 처리합니다.
 *              bcrypt를 사용하여 안전한 해시를 생성합니다.
 *
 * @example
 * ```typescript
 * const hashedPassword = await hashPassword('userPassword123')
 * console.log('해시된 비밀번호:', hashedPassword)
 * ```
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('비밀번호 해시 중 오류 발생:', error);
    throw new Error('비밀번호 해시에 실패했습니다');
  }
}

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
    const newInterest = userRepository.manager.getRepository('UserInterests').create({
      userId: validatedData.userId,
      content: validatedData.content,
    });

    // 데이터베이스에 저장
    const savedInterest = await userRepository.manager
      .getRepository('UserInterests')
      .save(newInterest);

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
    const interestRepository = userRepository.manager.getRepository('UserInterests');
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
    const interestRepository = userRepository.manager.getRepository('UserInterests');
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
