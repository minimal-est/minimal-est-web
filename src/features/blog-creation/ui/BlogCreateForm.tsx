import { useBlogCreation } from "../model/useBlogCreation";

export const BlogCreateForm = () => {
    const { penName, handlePenNameChange, isLoading, error, validationError, handleSubmit } = useBlogCreation();

    return (
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
                        onChange={(e) => handlePenNameChange(e.target.value)}
                        placeholder="예: 나의블로그, my-blog"
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                            validationError
                                ? "border-red-500 dark:border-red-400 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-violet-500"
                        }`}
                    />
                    <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            3자 이상 20자 이하, 한글/영문/숫자/하이픈(-)/언더스코어(_) 사용 가능
                        </p>
                        {validationError && (
                            <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                {validationError}
                            </p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !!validationError || !penName.trim()}
                    className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold mt-6"
                >
                    {isLoading ? "블로그 생성 중..." : "블로그 생성"}
                </button>
            </form>
        </div>
    );
};
