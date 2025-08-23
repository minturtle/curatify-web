'use server'

import { redirect } from 'next/navigation'
import { createSession, destroySession } from './session'
import { findUserByEmail, createUser, verifyPassword, hashPassword } from './user'
import { getSession } from './session'
import { loginSchema, signupSchema, ActionError } from '@/lib/types/auth'


/**
 * 사용자 로그인을 처리하는 Server Action입니다.
 * 
 * @param {FormData} formData - 로그인 폼에서 전송된 데이터 (email, password 포함)
 * @returns {Promise<null>} 로그인 성공 시
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
export async function loginAction(_: any, formData: FormData): Promise<ActionError | null> {
    try {
        // 익명 사용자만 로그인 가능
        const session = await getSession()
        if (session) {
            return { message: 'Already authenticated' }
        }

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        // zod를 사용한 폼 데이터 검증
        const validatedFields = loginSchema.safeParse({
            email,
            password,
        })

        if (!validatedFields.success) {
            const errorMessage = validatedFields.error.issues.map(issue => issue.message).join(', ')
            return { message: errorMessage }
        }

        const { email: validatedEmail, password: validatedPassword } = validatedFields.data

        // 사용자 찾기
        const user = await findUserByEmail(validatedEmail)
        if (!user) {
            return { message: '아이디/비밀번호가 일치하지 않습니다' }
        }

        // 비밀번호 검증
        const isValidPassword = await verifyPassword(validatedPassword, user.password)
        if (!isValidPassword) {
            return { message: '아이디/비밀번호가 일치하지 않습니다' }
        }

        // 세션 생성
        await createSession({
            id: user.id,
            email: user.email,
            name: user.name,
        })

        redirect('/')
    } catch (error) {
        // redirect는 그대로 throw
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
            throw error
        }
        if (error instanceof Error) {
            return { message: error.message }
        }
        return { message: 'Login failed' }
    }
}

/**
 * 사용자 회원가입을 처리하는 Server Action입니다.
 * 
 * @param {FormData} formData - 회원가입 폼에서 전송된 데이터 (name, email, password, confirmPassword 포함)
 * @returns {Promise<null>} 회원가입 성공 시 null 반환
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
export async function signupAction(_: any, formData: FormData): Promise<ActionError | null> {
    try {
        // 익명 사용자만 회원가입 가능
        const session = await getSession()
        if (session) {
            return { message: 'Already authenticated' }
        }

        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        // zod를 사용한 폼 데이터 검증
        const validatedFields = signupSchema.safeParse({
            name,
            email,
            password,
            confirmPassword,
        })

        if (!validatedFields.success) {
            const errorMessage = validatedFields.error.issues.map(issue => issue.message).join(', ')
            return { message: errorMessage }
        }

        const { name: validatedName, email: validatedEmail, password: validatedPassword } = validatedFields.data

        // 이메일 중복 확인
        const existingUser = await findUserByEmail(validatedEmail)
        if (existingUser) {
            return { message: '이미 존재하는 이메일입니다' }
        }

        // 비밀번호 해시
        const hashedPassword = await hashPassword(validatedPassword)

        // 사용자 생성
        const newUser = await createUser({
            email: validatedEmail,
            name: validatedName,
            password: hashedPassword,
        })

        // 세션 생성
        await createSession(newUser)

        redirect('/auth')
    } catch (error) {
        // redirect는 그대로 throw
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
            throw error
        }
        if (error instanceof Error) {
            return { message: error.message }
        }
        return { message: 'Signup failed' }
    }
}

/**
 * 사용자 로그아웃을 처리하는 Server Action입니다.
 * 
 * @returns {Promise<null>} 로그아웃 성공 시 null 반환
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
export async function logoutAction(): Promise<null> {
    try {
        await destroySession()
        return null
    } catch (error) {
        throw new Error('Logout failed')
    }
}
