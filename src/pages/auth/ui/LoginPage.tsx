import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/entities/auth/model";
import { loginUser } from "@/entities/auth/api/authApi";
import type { LoginRequest } from "@/entities/auth/model/types";

export const LoginPage = () => {
    const navigate = useNavigate();
    const { setUser, setAccessToken, setError, isLoading, setIsLoading, error } = useAuthStore();

    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await loginUser(formData);
            setAccessToken(result.accessToken);

            // 사용자 정보는 별도로 설정 (penName은 추후 API에서 가져오기)
            setUser({
                ...result.user,
                penName: formData.email.split("@")[0], // 임시
            });

            navigate("/");
        } catch (err: any) {
            const errorMessage = err?.response?.data?.detail || "로그인에 실패했습니다. 다시 시도해주세요.";
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
                        로그인
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        계정에 로그인하세요
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
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
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
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                {/* Signup Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        계정이 없으신가요?{" "}
                        <Link
                            to="/signup"
                            className="text-violet-600 dark:text-violet-400 hover:underline font-semibold"
                        >
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
