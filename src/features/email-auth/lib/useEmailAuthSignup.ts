import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupWithEmailVerification } from "../api/emailAuthApi";
import type { SignupRequest } from "@/entities/auth/model/types";
import { toast } from "sonner";

export const useEmailAuthSignup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignupRequest>({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // 입력할 때 에러 제거
        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.email) {
            errors.email = "이메일을 입력해주세요";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "유효한 이메일을 입력해주세요";
        }

        if (!formData.password) {
            errors.password = "비밀번호를 입력해주세요";
        } else if (formData.password.length < 8) {
            errors.password = "비밀번호는 8자 이상이어야 합니다";
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "비밀번호가 일치하지 않습니다";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 이메일 인증 기반 회원가입 신청
            await signupWithEmailVerification({
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });

            toast.success("확인 메일이 발송되었습니다. 이메일을 확인해주세요.");

            // 회원가입 신청 완료 후 이메일 전송 완료 페이지로 이동
            navigate("/auth/email-sent");
        } catch (err: any) {
            const errorMessage = err?.detail || "회원가입에 실패했습니다. 다시 시도해주세요.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        validationErrors,
        isLoading,
        error,
        handleChange,
        handleSubmit,
    };
};
