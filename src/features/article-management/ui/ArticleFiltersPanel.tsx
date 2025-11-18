import type { ArticleStatusFilter } from "@/entities/article/model/types";
import {
    ARTICLE_STATUS_ALL,
    ARTICLE_STATUS_DRAFT,
    ARTICLE_STATUS_PUBLISHED,
    ARTICLE_STATUS_LABELS
} from "@/shared/constants";

interface ArticleFiltersPanelProps {
    status: ArticleStatusFilter;
    setStatus: (status: ArticleStatusFilter) => void;
    searchInput: string;
    setSearchInput: (value: string) => void;
    onSearch: () => void;
}

export const ArticleFiltersPanel = ({
    status,
    setStatus,
    searchInput,
    setSearchInput,
    onSearch,
}: ArticleFiltersPanelProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="space-y-4">
                {/* 상태 필터 */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        상태
                    </label>
                    <div className="flex gap-3">
                        {[ARTICLE_STATUS_ALL, ARTICLE_STATUS_DRAFT, ARTICLE_STATUS_PUBLISHED].map((statusOption) => (
                            <button
                                key={statusOption}
                                onClick={() => setStatus(statusOption as ArticleStatusFilter)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    status === statusOption
                                        ? "bg-violet-600 text-white"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                            >
                                {ARTICLE_STATUS_LABELS[statusOption] || statusOption}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 검색 */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        제목 검색
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSearch()}
                            placeholder="검색할 제목을 입력하세요..."
                            className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-violet-600"
                        />
                        <button
                            onClick={onSearch}
                            className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                        >
                            검색
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
