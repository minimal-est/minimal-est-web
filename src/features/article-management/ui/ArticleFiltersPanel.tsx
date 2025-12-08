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
                        className={`px-3 py-1.5 text-xs font-medium transition-opacity ${
                            status === statusOption
                                ? "text-gray-900 dark:text-white font-semibold"
                                : "text-gray-600 dark:text-gray-400 hover:opacity-60"
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
                    className="flex-1 px-0 py-2 text-sm bg-transparent text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 outline-none focus:border-gray-900 dark:focus:border-white placeholder-gray-500 dark:placeholder-gray-600 transition-colors"
                />
                <button
                    onClick={onSearch}
                    className="px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity"
                >
                    검색
                </button>
            </div>
        </div>
    );
};
