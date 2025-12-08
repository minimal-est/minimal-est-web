import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Logo } from "@/shared/ui";

export const EmailSentPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Logo */}
            <div className="pt-6 px-4">
                <Logo />
            </div>

            <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-md px-4">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-violet-600 rounded-full opacity-20 animate-pulse" />
                        <Mail
                            size={80}
                            className="text-violet-600 dark:text-violet-400 relative"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        확인 메일이 발송되었습니다
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        가입하신 이메일을 확인해주세요.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        보낸 링크는 <b>24시간</b> 동안 유효합니다. <br /> 이메일을 발송하는데 최대 10분이 걸릴 수 있습니다.
                    </p>
                </div>

                {/* Buttons */}
                <button
                    onClick={() => navigate('/login')}
                    className="w-full px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors mb-4"
                >
                    로그인하러 가기
                </button>

                <button
                    onClick={() => navigate('/signup')}
                    className="w-full px-6 py-3 text-violet-600 dark:text-violet-400 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    다시 회원가입
                </button>
            </div>
            </div>
        </div>
    );
};
