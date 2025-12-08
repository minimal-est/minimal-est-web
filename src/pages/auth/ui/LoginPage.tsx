import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "@/shared/ui";
import { loginUser } from "@/entities/auth/api/authApi";
import type { LoginRequest } from "@/entities/auth/model/types";
import { useAuthStore } from "@/entities/user/lib";
import { queryClient } from "@/app/providers";

export const LoginPage = () => {
    const navigate = useNavigate();
    const { signIn } = useAuthStore();

    // SEO 메타 태그 설정
    useEffect(() => {
        document.title = "로그인 | Minimal-est Web";

        const updateMeta = (name: string, content: string) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        updateMeta('description', 'Minimal-est Web에 로그인하세요.');

        return () => {};
    }, []);

    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            signIn(result.accessToken);
            // 로그인 성공 후 사용자 관련 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: ['blog'] });
            navigate("/");
        } catch (err: any) {
            const errorMessage = err?.response?.data?.detail || "로그인에 실패했습니다. 다시 시도해주세요.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-white dark:bg-gray-950 flex flex-col">
            {/* Logo */}
            <div className="pt-6 px-4">
                <Logo />
            </div>

            {/* Content */}
            <div className="flex items-center justify-center flex-1 px-4">
                <div className="w-full max-w-sm">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            로그인
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-500">
                            계정에 로그인하세요
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                이메일
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                required
                                className="w-full px-0 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="8자 이상 입력"
                                required
                                className="w-full px-0 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium text-sm"
                        >
                            {isLoading ? "로그인 중..." : "로그인"}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="mt-8 text-center text-sm">
                        <p className="text-gray-600 dark:text-gray-500">
                            계정이 없으신가요?{" "}
                            <Link
                                to="/signup"
                                className="text-gray-900 dark:text-white font-medium hover:opacity-70 transition-opacity"
                            >
                                회원가입
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
