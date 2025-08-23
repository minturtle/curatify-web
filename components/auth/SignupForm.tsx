"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signupAction } from "@/lib/auth/actions"
import { ActionError } from "@/lib/types/auth"

export default function SignupForm() {
    const [state, formAction, isPending] = useActionState<ActionError | null, FormData>(
        signupAction,
        null
    )

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
                <form action={formAction} className="space-y-4">
                    {state && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {state.message}
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
                            disabled={isPending}
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
                            disabled={isPending}
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
                            disabled={isPending}
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
                            disabled={isPending}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "회원가입 중..." : "회원가입"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
