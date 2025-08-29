import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { findUserById } from '@/lib/auth/userService'

/**
 * 인증 상태 확인 API 엔드포인트
 * 
 * @description 현재 사용자의 인증 상태를 확인하고 유효한 사용자 정보를 반환합니다.
 *              세션에 저장된 사용자 ID가 실제로 데이터베이스에 존재하는지 검증하여
 *              보안을 강화합니다.
 * 
 * @returns {Promise<NextResponse>} 인증 상태와 사용자 정보를 포함한 JSON 응답
 * 
 * @example
 * ```typescript
 * // 성공 응답
 * {
 *   isAuthenticated: true,
 *   user: {
 *     id: "1",
 *     email: "user@example.com",
 *     name: "사용자명",
 *     isVerified: true
 *   }
 * }
 * 
 * // 인증되지 않은 경우
 * {
 *   isAuthenticated: false,
 *   user: null
 * }
 * ```
 * 
 * @throws {Error} 데이터베이스 연결 오류 또는 사용자 조회 실패 시
 * 
 * @author Minseok kim
 */
export async function GET() {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({
                isAuthenticated: false,
                user: null,
            })
        }

        // 세션의 userId가 실제로 DB에 존재하는지 확인
        if (!session.userId) {
            console.warn('세션에 userId가 없습니다.')
            return NextResponse.json({
                isAuthenticated: false,
                user: null,
            })
        }

        const user = await findUserById(session.userId)

        if (!user) {
            // 사용자가 DB에 존재하지 않으면 인증되지 않은 것으로 처리
            console.warn(`세션의 사용자 ID(${session.userId})가 데이터베이스에 존재하지 않습니다.`)
            return NextResponse.json({
                isAuthenticated: false,
                user: null,
            })
        }

        return NextResponse.json({
            isAuthenticated: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isVerified: user.isVerified,
            },
        })
    } catch (error) {
        console.error('Auth status check error:', error)
        return NextResponse.json({
            isAuthenticated: false,
            user: null,
        })
    }
}
