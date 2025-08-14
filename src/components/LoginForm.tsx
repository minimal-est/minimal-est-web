import { loginSchema, type LoginFormData } from "@/schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useLogin } from "@/hooks/useLogin";
import { useState } from "react";
import type { ErrorResponse, LoginResponse } from "@/apis/types";
import { CircleXIcon } from "lucide-react";

interface LoginFormProps {
    onSuccess: (data: LoginResponse) => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {

    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const { mutate, isPending } = useLogin();

    const onSubmit = (formData: LoginFormData) => {
        setErrorMessage("");
        mutate(formData, {
            onSuccess: (data: LoginResponse) => {
                onSuccess(data);
            },
            onError: (err: ErrorResponse) => {
                if (err.status === 401) {
                    setErrorMessage("올바른 계정이 아닙니다!");
                } else {
                    setErrorMessage("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.")
                }
            }
        });
    }

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
                    <div className="flex items-center gap-2">
                        <Button 
                            type="submit"
                            disabled={isPending}
                        >
                            로그인
                        </Button>
                        {errorMessage && (
                            <div className="flex  text-red-500">
                                <CircleXIcon />&nbsp;{errorMessage}
                            </div>
                        )}

                    </div>
                </form>
            </Form>
        </div>
    )
}

export default LoginForm;