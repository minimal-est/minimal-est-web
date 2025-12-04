import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Logo } from "@/shared/ui";

export const VerificationExpiredPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Logo */}
            <div className="pt-6 px-4">
                <Logo />
            </div>

            <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-md px-4">
                {/* Error Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-600 rounded-full opacity-20 animate-pulse" />
                        <AlertCircle
                            size={80}
                            className="text-red-600 dark:text-red-400 relative"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        인증 링크가 만료되었습니다
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        인증 링크의 유효 시간이 지났습니다. 다시 회원가입을 진행해주세요.
                    </p>
                </div>

                {/* Signup Button */}
                <button
                    onClick={() => navigate('/signup')}
                    className="w-full px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors mb-4"
                >
                    다시 회원가입하기
                </button>

                {/* Back to Home */}
                <button
                    onClick={() => navigate('/')}
                    className="w-full px-6 py-3 text-violet-600 dark:text-violet-400 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    홈으로 돌아가기
                </button>
            </div>
            </div>
        </div>
    );
};
