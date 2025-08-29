import { z } from 'zod'

/**
 * 인증 관련 타입 정의
 * @author Minseok kim
 */

export interface SessionData {
    userId?: string
    email?: string
    role?: 'approved' | 'not_approved'
}

/**
 * 사용자 정보
 */
export interface UserData {
    id: string
    email: string
    name: string
    isVerified: boolean
}

/**
 * 비밀번호가 포함된 사용자 정보
 */
export interface UserWithPassword extends UserData {
    password: string
}

/**
 * 로그인 폼 데이터 검증 스키마
 */
export const loginSchema = z.object({
    email: z.email('유효한 이메일 주소를 입력해주세요'),
    password: z.string().min(1, '비밀번호를 입력해주세요'),
})

/**
 * 회원가입 폼 데이터 검증 스키마
 */
export const signupSchema = z.object({
    name: z.string().min(1, '이름을 입력해주세요').max(50, '이름은 50자 이하여야 합니다'),
    email: z.email('유효한 이메일 주소를 입력해주세요'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
}).refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
})

/**
 * useActionState를 위한 에러 타입
 */
export type ActionError = {
    message: string
}
