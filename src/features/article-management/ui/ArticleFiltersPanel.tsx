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
        <div className="mb-6 space-y-4">
            {/* 상태 필터 */}
            <div className="flex gap-2">
                {[ARTICLE_STATUS_ALL, ARTICLE_STATUS_DRAFT, ARTICLE_STATUS_PUBLISHED].map((statusOption) => (
                    <button
                        key={statusOption}
                        onClick={() => setStatus(statusOption as ArticleStatusFilter)}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                            status === statusOption
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                    >
                        {ARTICLE_STATUS_LABELS[statusOption] || statusOption}
                    </button>
                ))}
            </div>

            {/* 검색 */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    placeholder="제목으로 검색..."
                    className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded outline-none focus:ring-1 focus:ring-gray-400"
                />
                <button
                    onClick={onSearch}
                    className="px-4 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:opacity-90 transition-opacity font-medium"
                >
                    검색
                </button>
            </div>
        </div>
    );
};
