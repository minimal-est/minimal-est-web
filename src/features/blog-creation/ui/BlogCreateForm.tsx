import { useBlogCreation } from "../model/useBlogCreation";

export const BlogCreateForm = () => {
    const { penName, handlePenNameChange, isLoading, error, validationError, handleSubmit } = useBlogCreation();

    return (
        <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    블로그 생성
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-500">
                    당신만의 공간을 만들어보세요
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
                {/* Pen Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        필명
                    </label>
                    <input
                        type="text"
                        value={penName}
                        onChange={(e) => handlePenNameChange(e.target.value)}
                        placeholder="나의블로그"
                        className={`w-full px-0 py-2 bg-transparent border-b text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none transition-colors ${
                            validationError
                                ? "border-red-500 dark:border-red-400 focus:border-red-600 dark:focus:border-red-300"
                                : "border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white"
                        }`}
                    />
                    <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-600">
                            3-20자 / 한글, 영문, 숫자, -, _ 사용 가능
                        </p>
                        {validationError && (
                            <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                {validationError}
                            </p>
                        )}
                        {penName.trim() && !validationError && (
                            <p className="text-xs text-gray-500 dark:text-gray-600">
                                URL: /b/{penName}
                            </p>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="pt-2 pb-2">
                    <p className="text-xs text-gray-600 dark:text-gray-500">
                        필명은 생성 후 변경할 수 없습니다.
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !!validationError || !penName.trim()}
                    className="w-full py-2.5 mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium text-sm"
                >
                    {isLoading ? "생성 중..." : "블로그 생성"}
                </button>
            </form>
        </div>
    );
};
