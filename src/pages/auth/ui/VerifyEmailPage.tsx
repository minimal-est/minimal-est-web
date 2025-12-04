import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Logo } from "@/shared/ui";
import { useAuth } from "@/entities/user/lib";

export const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const {  } = useAuth();

    // useEffect(() => {
    //     // 페이지 진입 시 로그아웃
    //     logout();
    // }, [logout]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Logo */}
            <div className="pt-6 px-4">
                <Logo />
            </div>

            <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-md px-4">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-violet-600 rounded-full opacity-20 animate-ping" />
                        <CheckCircle
                            size={80}
                            className="text-violet-600 dark:text-violet-400 relative"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        이메일 인증이 완료되었습니다!
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        이제 로그인하여 Minimal-est를 시작할 수 있습니다.
                    </p>
                </div>

                {/* Login Button */}
                <button
                    onClick={() => navigate('/login')}
                    className="w-full px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors mb-4"
                >
                    로그인하러 가기
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
