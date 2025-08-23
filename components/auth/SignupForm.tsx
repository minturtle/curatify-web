"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signupAction } from "@/lib/auth/actions"
import { useRouter } from "next/navigation"

export default function SignupForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData(e.currentTarget)
            const result = await signupAction(formData)

            if (result.success) {
                // 회원가입 성공 시 홈페이지로 리다이렉트
                router.push('/')
                router.refresh()
            } else {
                setError(result.error || 'Signup failed')
            }
        } catch (error) {
            setError('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-2">
                <div className="text-center">
                    <CardTitle className="text-2xl font-bold">
                        회원가입
                    </CardTitle>
                    <CardDescription>
                        새로운 계정을 만들어 서비스를 시작하세요
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            이름
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="홍길동"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="signupEmail" className="text-sm font-medium">
                            이메일
                        </label>
                        <Input
                            id="signupEmail"
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="signupPassword" className="text-sm font-medium">
                            비밀번호
                        </label>
                        <Input
                            id="signupPassword"
                            name="password"
                            type="password"
                            placeholder="8자 이상 입력하세요"
                            required
                            disabled={isLoading}
                            minLength={8}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                            비밀번호 확인
                        </label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "회원가입 중..." : "회원가입"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
