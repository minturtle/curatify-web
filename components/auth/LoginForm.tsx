"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loginAction } from "@/lib/auth/actions"
import { ActionError } from "@/lib/types/auth"

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState<ActionError | null, FormData>(
        loginAction,
        null
    )

    return (
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-2">
                <div className="text-center">
                    <CardTitle className="text-2xl font-bold">
                        로그인
                    </CardTitle>
                    <CardDescription>
                        계정에 로그인하여 서비스를 이용하세요
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
                        <label htmlFor="email" className="text-sm font-medium">
                            이메일
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            비밀번호
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button variant="link" size="sm" className="px-0">
                            비밀번호 찾기
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "로그인 중..." : "로그인"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
