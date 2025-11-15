import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "@/entities/blog/api";
import { useAuthStore } from "@/entities/user/lib";

export const BlogCreatePage = () => {
    const navigate = useNavigate();
    const { setBlogInfo } = useAuthStore();

    const [penName, setPenName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validate = (): boolean => {
        const errors: Record<string, string> = {};

        if (!penName.trim()) {
            errors.penName = "필명을 입력해주세요";
        } else if (penName.length < 2) {
            errors.penName = "필명은 2자 이상이어야 합니다";
        } else if (penName.length > 50) {
            errors.penName = "필명은 50자 이하여야 합니다";
        }

        if (Object.keys(errors).length > 0) {
            setError(errors.penName || "입력값을 확인해주세요");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 백엔드 API 호출
            const response = await createBlog({ penName });

            // 스토어에 블로그 정보 저장
            setBlogInfo(response.blogId, penName);

            navigate("/");
        } catch (err: any) {
            const errorMessage = err?.detail || "블로그 생성에 실패했습니다. 다시 시도해주세요.";
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
                        블로그 생성
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        당신의 필명으로 블로그를 만들어보세요
                    </p>
                </div>

                {/* Info Message */}
                <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-200 rounded">
                    <p className="text-sm">
                        필명은 블로그의 URL이 되며, 글을 작성하기 위해 필수입니다.
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
                    {/* Pen Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            필명 *
                        </label>
                        <input
                            type="text"
                            value={penName}
                            onChange={(e) => setPenName(e.target.value)}
                            placeholder="예: my-blog"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            2자 이상 50자 이하의 필명을 입력해주세요
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold mt-6"
                    >
                        {isLoading ? "블로그 생성 중..." : "블로그 생성"}
                    </button>
                </form>
            </div>
        </div>
    );
};
