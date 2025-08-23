"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // TODO: 로그인 로직 구현
        setTimeout(() => setIsLoading(false), 1000)
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // TODO: 회원가입 로직 구현
        setTimeout(() => setIsLoading(false), 1000)
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-start pt-20 p-4">
            <div className="w-full max-w-md">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">로그인</TabsTrigger>
                        <TabsTrigger value="signup">회원가입</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="mt-0">
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
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">
                                            이메일
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="example@email.com"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="password" className="text-sm font-medium">
                                            비밀번호
                                        </label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="비밀번호를 입력하세요"
                                            required
                                            disabled={isLoading}
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
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "로그인 중..." : "로그인"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signup" className="mt-0">
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
                                <form onSubmit={handleSignup} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">
                                            이름
                                        </label>
                                        <Input
                                            id="name"
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
