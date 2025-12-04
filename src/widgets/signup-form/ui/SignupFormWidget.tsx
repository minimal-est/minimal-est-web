import { Link } from "react-router-dom";
import { Logo } from "@/shared/ui";
import { useEmailAuthSignup } from "@/features/email-auth";

export const SignupFormWidget = () => {
    const {
        formData,
        validationErrors,
        isLoading,
        error,
        handleChange,
        handleSubmit,
    } = useEmailAuthSignup();

    return (
        <div className="w-full min-h-screen bg-white dark:bg-gray-900 flex flex-col">
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
                            회원가입
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-500">
                            새 계정을 만들어보세요
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
                                placeholder="이메일 주소 입력"
                                className={`w-full px-0 py-2 bg-transparent border-b text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none transition-colors ${
                                    validationErrors.email
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white"
                                }`}
                            />
                            {validationErrors.email && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    {validationErrors.email}
                                </p>
                            )}
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
                                className={`w-full px-0 py-2 bg-transparent border-b text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none transition-colors ${
                                    validationErrors.password
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white"
                                }`}
                            />
                            {validationErrors.password && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Password Confirm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                비밀번호 확인
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="다시 입력하세요"
                                className={`w-full px-0 py-2 bg-transparent border-b text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none transition-colors ${
                                    validationErrors.confirmPassword
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white"
                                }`}
                            />
                            {validationErrors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    {validationErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* 이용약관 문구 */}
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                회원가입 시,{" "}
                                <a
                                    href="/terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-900 dark:text-white font-medium underline hover:opacity-70 transition-opacity"
                                >
                                    이용약관
                                </a>
                                {" "}및{" "}
                                <a
                                    href="/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-900 dark:text-white font-medium underline hover:opacity-70 transition-opacity"
                                >
                                    개인정보 처리방침
                                </a>
                                에 동의합니다.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium text-sm"
                        >
                            {isLoading ? "회원가입 중..." : "회원가입"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center text-sm">
                        <p className="text-gray-600 dark:text-gray-500">
                            이미 계정이 있으신가요?{" "}
                            <Link
                                to="/login"
                                className="text-gray-900 dark:text-white font-medium hover:opacity-70 transition-opacity"
                            >
                                로그인
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
