import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .email("이메일 형식을 지켜주세요."),
    password: z
        .string("비밀번호를 입력해주세요.")
        .min(1, "비밀번호를 입력해주세요."),
});

export type LoginFormData = z.infer<typeof loginSchema>;