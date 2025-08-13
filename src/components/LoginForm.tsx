import { loginSchema, type LoginFormData } from "@/schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useLogin } from "@/hooks/useLogin";
import { useEffect } from "react";
import type { LoginResponse } from "@/apis/types";

const LoginForm = () => {

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const { mutate, data, isPending, isError, error } = useLogin();

    const onSubmit = (formData: LoginFormData) => {
        mutate(formData, {
            onSuccess: (data: LoginResponse) => {
            }
        });
    }

    useEffect(() => {
        if (isError && error) {
            if (error.status === 401) {
                // 로그인 실패(인증 실패) 예외
            }
        }
    }, [isError, error])

    return (
        <div className="w-full flex justify-center items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 flex-col justify-center items-center">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>이메일</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="example@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>비밀번호</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem> 
                        )}
                    />
                    
                    <Button 
                        type="submit"
                        disabled={isPending}
                    >
                        로그인
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default LoginForm;