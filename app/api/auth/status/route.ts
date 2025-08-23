import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function GET() {
    try {
        const session = await getSession()
        return NextResponse.json({
            isAuthenticated: !!session,
            user: session ? {
                id: session.userId,
                email: session.email,
                role: session.role,
            } : null,
        })
    } catch (error) {
        console.error('Auth status check error:', error)
        return NextResponse.json({
            isAuthenticated: false,
            user: null,
        })
    }
}
