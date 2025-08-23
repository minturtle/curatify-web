'use server'

import { redirect } from 'next/navigation'
import { createSession, destroySession } from './session'
import { findUserByEmail, createUser, verifyPassword, hashPassword } from './user'
import { getSession } from './session'
import { AuthResult } from '@/lib/types/auth'

/**
 * 사용자 로그인을 처리하는 Server Action입니다.
 * 
 * @param {FormData} formData - 로그인 폼에서 전송된 데이터 (email, password 포함)
 * @returns {Promise<AuthResult>} 로그인 성공/실패 결과
 * @description 이메일과 비밀번호를 검증하고 성공 시 세션을 생성합니다.
 *              이미 로그인된 사용자는 접근할 수 없습니다.
 * 
 * @throws {Error} 이미 인증된 사용자가 접근할 때 'Already authenticated' 에러 발생
 * 
 * @example
 * ```typescript
 * // 폼에서 사용
 * <form action={loginAction}>
 *   <input name="email" type="email" required />
 *   <input name="password" type="password" required />
 *   <button type="submit">로그인</button>
 * </form>
 * ```
 */
export async function loginAction(formData: FormData): Promise<AuthResult> {
    try {
        // 익명 사용자만 로그인 가능
        const session = await getSession()
        if (session) {
            throw new Error('Already authenticated')
        }

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            return { success: false, error: 'Email and password are required' }
        }

        // 사용자 찾기
        const user = await findUserByEmail(email)
        if (!user) {
            return { success: false, error: 'Invalid credentials' }
        }

        // 비밀번호 검증
        const isValidPassword = await verifyPassword(password, user.password)
        if (!isValidPassword) {
            return { success: false, error: 'Invalid credentials' }
        }

        // 세션 생성
        await createSession({
            id: user.id,
            email: user.email,
            name: user.name,
        })

        return { success: true }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: 'Login failed' }
    }
}

/**
 * 사용자 회원가입을 처리하는 Server Action입니다.
 * 
 * @param {FormData} formData - 회원가입 폼에서 전송된 데이터 (name, email, password, confirmPassword 포함)
 * @returns {Promise<AuthResult>} 회원가입 성공/실패 결과
 * @description 새로운 사용자를 생성하고 즉시 로그인 처리합니다.
 *              이메일 중복 확인과 비밀번호 일치 확인을 수행합니다.
 *              생성된 사용자는 기본적으로 'not_approved' 상태로 설정됩니다.
 * 
 * @throws {Error} 이미 인증된 사용자가 접근할 때 'Already authenticated' 에러 발생
 * 
 * @example
 * ```typescript
 * // 폼에서 사용
 * <form action={signupAction}>
 *   <input name="name" type="text" required />
 *   <input name="email" type="email" required />
 *   <input name="password" type="password" required />
 *   <input name="confirmPassword" type="password" required />
 *   <button type="submit">회원가입</button>
 * </form>
 * ```
 */
export async function signupAction(formData: FormData): Promise<AuthResult> {
    try {
        // 익명 사용자만 회원가입 가능
        const session = await getSession()
        if (session) {
            throw new Error('Already authenticated')
        }

        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!name || !email || !password || !confirmPassword) {
            return { success: false, error: 'All fields are required' }
        }

        // 비밀번호 확인
        if (password !== confirmPassword) {
            return { success: false, error: 'Passwords do not match' }
        }

        // 이메일 중복 확인
        const existingUser = await findUserByEmail(email)
        if (existingUser) {
            return { success: false, error: 'Email already exists' }
        }

        // 비밀번호 해시
        const hashedPassword = await hashPassword(password)

        // 사용자 생성
        const newUser = await createUser({
            email,
            name,
            password: hashedPassword,
        })

        // 세션 생성
        await createSession(newUser)

        return { success: true }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: 'Signup failed' }
    }
}

/**
 * 사용자 로그아웃을 처리하는 Server Action입니다.
 * 
 * @returns {Promise<AuthResult>} 로그아웃 성공/실패 결과
 * @description 현재 사용자의 세션을 완전히 삭제하고 쿠키도 제거합니다.
 *              인증 상태와 관계없이 호출할 수 있습니다.
 * 
 * @example
 * ```typescript
 * // 버튼에서 사용
 * <form action={logoutAction}>
 *   <button type="submit">로그아웃</button>
 * </form>
 * 
 * // 또는 함수로 직접 호출
 * const result = await logoutAction()
 * if (result.success) {
 *   router.push('/login')
 * }
 * ```
 */
export async function logoutAction(): Promise<AuthResult> {
    try {
        await destroySession()
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Logout failed' }
    }
}
