import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loginAction, signupAction, logoutAction } from '@/lib/auth/actions'
import { createSession, destroySession } from '@/lib/auth/session'
import { findUserByEmail, createUser, verifyPassword, hashPassword } from '@/lib/auth/user'
import { getSession } from '@/lib/auth/session'
import { SessionData, UserData, UserWithPassword, ActionError } from '@/lib/types/auth'

// Mock dependencies
vi.mock('@/lib/auth/session', () => ({
    getSession: vi.fn(),
    createSession: vi.fn(),
    destroySession: vi.fn(),
}))

vi.mock('@/lib/auth/user', () => ({
    findUserByEmail: vi.fn(),
    createUser: vi.fn(),
    verifyPassword: vi.fn(),
    hashPassword: vi.fn(),
}))

vi.mock('next/navigation', () => ({
    redirect: vi.fn().mockImplementation((url: string) => {
        throw new Error(`NEXT_REDIRECT: ${url}`)
    }),
}))



describe('Auth Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('loginAction', () => {
        it('유효한 자격 증명으로 로그인에 성공해야 한다', async () => {
            const mockFormData = new FormData()
            mockFormData.append('email', 'test@example.com')
            mockFormData.append('password', 'password123')

            const mockUser: UserWithPassword = {
                id: '123',
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            }
            const mockSession: SessionData = {
                userId: '123',
                email: 'test@example.com',
                role: 'not_approved',
            }

            vi.mocked(getSession).mockResolvedValue(null)
            vi.mocked(findUserByEmail).mockResolvedValue(mockUser)
            vi.mocked(createSession).mockResolvedValue(mockSession)
            vi.mocked(verifyPassword).mockResolvedValue(true)

            // redirect가 호출되므로 예외가 발생할 것
            await expect(loginAction(null, mockFormData)).rejects.toThrow('NEXT_REDIRECT')

            expect(createSession).toHaveBeenCalledWith({
                id: mockUser.id,
                email: mockUser.email,
                name: mockUser.name,
            })
        })

        it('잘못된 자격 증명에 대해 에러를 반환해야 한다', async () => {
            const mockFormData = new FormData()
            mockFormData.append('email', 'invalid@example.com')
            mockFormData.append('password', 'wrongpassword')

            vi.mocked(getSession).mockResolvedValue(null)
            vi.mocked(findUserByEmail).mockResolvedValue(null)

            const result = await loginAction(null, mockFormData)

            expect(result).toEqual({ message: '아이디/비밀번호가 일치하지 않습니다' })
        })
    })

    describe('signupAction', () => {
        it('유효한 데이터로 회원가입에 성공해야 한다', async () => {
            const mockFormData = new FormData()
            mockFormData.append('name', 'Test User')
            mockFormData.append('email', 'test@example.com')
            mockFormData.append('password', 'password123')
            mockFormData.append('confirmPassword', 'password123')

            const mockNewUser: UserData = {
                id: '123',
                email: 'test@example.com',
                name: 'Test User',
            }
            const mockSession: SessionData = {
                userId: '123',
                email: 'test@example.com',
                role: 'not_approved',
            }

            vi.mocked(getSession).mockResolvedValue(null)
            vi.mocked(findUserByEmail).mockResolvedValue(null)
            vi.mocked(createUser).mockResolvedValue(mockNewUser)
            vi.mocked(createSession).mockResolvedValue(mockSession)
            vi.mocked(hashPassword).mockResolvedValue('hashedPassword123')

            // redirect가 호출되므로 예외가 발생할 것
            await expect(signupAction(null, mockFormData)).rejects.toThrow('NEXT_REDIRECT')

            expect(createUser).toHaveBeenCalledWith({
                email: 'test@example.com',
                name: 'Test User',
                password: 'hashedPassword123',
            })
            expect(createSession).toHaveBeenCalledWith(mockNewUser)
        })

        it('비밀번호가 일치하지 않으면 에러를 반환해야 한다', async () => {
            const mockFormData = new FormData()
            mockFormData.append('name', 'Test User')
            mockFormData.append('email', 'test@example.com')
            mockFormData.append('password', 'password123')
            mockFormData.append('confirmPassword', 'differentpassword')

            vi.mocked(getSession).mockResolvedValue(null)

            const result = await signupAction(null, mockFormData)

            expect(result).toEqual({ message: '비밀번호가 일치하지 않습니다' })
        })

        it('이미 존재하는 이메일에 대해 에러를 반환해야 한다', async () => {
            const mockFormData = new FormData()
            mockFormData.append('name', 'Test User')
            mockFormData.append('email', 'existing@example.com')
            mockFormData.append('password', 'password123')
            mockFormData.append('confirmPassword', 'password123')

            const mockExistingUser: UserWithPassword = {
                id: '123',
                email: 'existing@example.com',
                name: 'Existing User',
                password: 'password123',
            }

            vi.mocked(getSession).mockResolvedValue(null)
            vi.mocked(findUserByEmail).mockResolvedValue(mockExistingUser)

            const result = await signupAction(null, mockFormData)

            expect(result).toEqual({ message: '이미 존재하는 이메일입니다' })
        })
    })

    describe('logoutAction', () => {
        it('로그아웃에 성공해야 한다', async () => {
            vi.mocked(destroySession).mockResolvedValue(undefined)

            const result = await logoutAction()

            expect(result).toBeNull()
            expect(destroySession).toHaveBeenCalled()
        })

        it('로그아웃 에러를 throw해야 한다', async () => {
            vi.mocked(destroySession).mockRejectedValue(
                new Error('Logout failed')
            )

            await expect(logoutAction()).rejects.toThrow('Logout failed')
        })
    })
})
