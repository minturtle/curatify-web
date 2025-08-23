import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getSession, createSession, destroySession } from '@/lib/auth/session'
import { SessionData, UserData } from '@/lib/types/auth'

// Mock Next.js cookies
vi.mock('next/headers', () => ({
    cookies: vi.fn(() => Promise.resolve({
        get: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
    })),
}))

// Mock iron-session
vi.mock('iron-session', () => ({
    getIronSession: vi.fn(),
}))

describe('Session Management', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createSession', () => {
        it('사용자 데이터로 새 세션을 생성해야 한다', async () => {
            const mockSession = {
                userId: '123',
                email: 'test@example.com',
                role: 'not_approved',
                save: vi.fn(),
                destroy: vi.fn(),
                updateConfig: vi.fn(),
            }
            const { getIronSession } = await import('iron-session')
            vi.mocked(getIronSession).mockResolvedValue(mockSession)

            const userData: UserData = {
                id: '123',
                email: 'test@example.com',
                name: 'Test User',
            }

            const session = await createSession(userData)
            expect(session).toEqual({
                userId: userData.id,
                email: userData.email,
                role: 'not_approved',
                save: expect.any(Function),
                destroy: expect.any(Function),
                updateConfig: expect.any(Function),
            })
            expect(mockSession.save).toHaveBeenCalled()
        })
    })

    describe('destroySession', () => {
        it('현재 세션을 삭제해야 한다', async () => {
            const mockSession = {
                userId: '123',
                email: 'test@example.com',
                role: 'not_approved',
                save: vi.fn(),
                destroy: vi.fn(),
                updateConfig: vi.fn(),
            }
            const { getIronSession } = await import('iron-session')
            vi.mocked(getIronSession).mockResolvedValue(mockSession)

            await destroySession()
            expect(mockSession.destroy).toHaveBeenCalled()
        })
    })
})
