"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            // TODO: Server Action 호출
            console.log("회원가입 시도:", { name, email, password, confirmPassword })
            await new Promise(resolve => setTimeout(resolve, 1000))
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
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            이름
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="홍길동"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            type="password"
                            placeholder="8자 이상 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
