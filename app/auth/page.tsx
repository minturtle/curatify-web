"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/components/auth/LoginForm"
import SignupForm from "@/components/auth/SignupForm"

export default function AuthPage() {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-start pt-20 p-4">
            <div className="w-full max-w-md">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">로그인</TabsTrigger>
                        <TabsTrigger value="signup">회원가입</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="mt-0">
                        <LoginForm />
                    </TabsContent>

                    <TabsContent value="signup" className="mt-0">
                        <SignupForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
