/**
 * 인증 관련 타입 정의
 * @author Minseok kim
 */

export interface SessionData {
    userId?: string
    email?: string
    role?: 'approved' | 'not_approved'
}

export interface UserData {
    id: string
    email: string
    name: string
}

export interface AuthResult {
    success: boolean
    error?: string
}

export interface LoginFormData {
    email: string
    password: string
}

export interface SignupFormData {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface UserWithPassword extends UserData {
    password: string
}
