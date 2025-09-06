import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, UserData } from '@/lib/types/auth';

const sessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: 'curatify-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * 현재 요청의 세션을 가져옵니다.
 *
 * @returns {Promise<SessionData | null>} 유효한 세션이 있으면 SessionData, 없으면 null
 * @description iron-session을 사용하여 암호화된 쿠키에서 세션 데이터를 추출합니다.
 *              세션이 없거나 필수 필드(userId, email)가 누락된 경우 null을 반환합니다.
 *
 * @example
 * ```typescript
 * const session = await getSession()
 * if (session) {
 *   console.log(`사용자 ${session.email}의 세션`)
 * }
 * ```
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  // 세션이 비어있거나 필수 필드가 없으면 null 반환
  if (!session || !session.userId || !session.email) {
    return null;
  }

  return session;
}

/**
 * 새로운 사용자 세션을 생성합니다.
 *
 * @param {UserData} userData - 세션에 저장할 사용자 데이터
 * @returns {Promise<SessionData>} 생성된 세션 데이터
 * @description 사용자 로그인/회원가입 시 새로운 세션을 생성하고 암호화된 쿠키에 저장합니다.
 *              사용자의 인증 상태(isVerified)를 세션에 포함시킵니다.
 *
 * @example
 * ```typescript
 * const userData = { id: '123', email: 'user@example.com', name: 'User' }
 * const session = await createSession(userData)
 * console.log(`세션이 생성되었습니다: ${session.userId}`)
 * ```
 */
export async function createSession(userData: UserData): Promise<SessionData> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  session.userId = userData.id;
  session.email = userData.email;
  session.isVerified = userData.isVerified;

  await session.save();

  return session;
}

/**
 * 현재 사용자의 세션을 삭제합니다.
 *
 * @returns {Promise<void>} 비동기 작업 완료를 의미하는 Promise
 * @description 사용자 로그아웃 시 세션을 완전히 삭제하고 쿠키도 제거합니다.
 *
 * @example
 * ```typescript
 * await destroySession()
 * console.log('로그아웃되었습니다')
 * ```
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  session.destroy();
}
