import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/entities/auth/model";
import { signupUser } from "@/entities/auth/api/signupApi";
import { loginUser } from "@/entities/auth/api/authApi";
import type { SignupRequest } from "@/entities/auth/model/types";
import type { SignupResponse } from "@/entities/auth/api/signupApi";

export const SignupPage = () => {
    const navigate = useNavigate();
    const { setUser, setAccessToken, setError, isLoading, setIsLoading, error } = useAuthStore();

    const [formData, setFormData] = useState<SignupRequest>({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
            // 1. 회원가입
            const signupResult: SignupResponse = await signupUser({
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });

            // 2. 자동 로그인
            const loginResult = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            setAccessToken(loginResult.accessToken);
            setUser({
                userId: signupResult.userUUID,
                email: formData.email,
                penName: "",
            });

            navigate("/blog-create");
        } catch (err: any) {
            const errorMessage = err?.detail || "회원가입에 실패했습니다. 다시 시도해주세요.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        회원가입
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        새 계정을 만들어보세요
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            이메일
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                validationErrors.email
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-violet-500"
                            }`}
                        />
                        {validationErrors.email && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {validationErrors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                validationErrors.password
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-violet-500"
                            }`}
                        />
                        {validationErrors.password && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {validationErrors.password}
                            </p>
                        )}
                    </div>

                    {/* Password Confirm */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            비밀번호 확인
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                validationErrors.confirmPassword
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-violet-500"
                            }`}
                        />
                        {validationErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {validationErrors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold mt-6"
                    >
                        {isLoading ? "회원가입 중..." : "회원가입"}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        이미 계정이 있으신가요?{" "}
                        <Link
                            to="/login"
                            className="text-violet-600 dark:text-violet-400 hover:underline font-semibold"
                        >
                            로그인
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
