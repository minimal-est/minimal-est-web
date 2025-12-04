import { useNavigate } from "react-router-dom";
import { Trash2, Edit3, Plus } from "lucide-react";
import type { MyArticlesResponse, MyArticleSummary } from "@/entities/article/model/types";
import { ARTICLE_STATUS_LABELS, ARTICLE_STATUS_DRAFT } from "@/shared/constants";
import { ReactionStatsSection } from "@/features/article-reacting";

interface ArticleListTableProps {
    articlesData: MyArticlesResponse | undefined;
    isLoading: boolean;
    error: Error | null;
    isDeleting: boolean;
    onEdit: (articleId: string) => void;
    onDelete: (articleId: string) => void;
}

export const ArticleListTable = ({
    articlesData,
    isLoading,
    error,
    isDeleting,
    onEdit,
    onDelete,
}: ArticleListTableProps) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">글을 로드 중입니다...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-600">
                <p>글 목록을 불러올 수 없습니다.</p>
            </div>
        );
    }

    if (!articlesData || articlesData.content.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">작성한 글이 없습니다.</p>
                <button
                    onClick={() => navigate("/articles/create")}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                    <Plus size={18} />
                    새 글 작성
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {articlesData.content.map((article: MyArticleSummary) => (
                <div
                    key={article.articleId}
                    className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <button
                                onClick={() => navigate(`/articles/${article.author.penName}/${article.articleId}`)}
                                className="text-sm font-medium text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 truncate block"
                            >
                                {article.title || "(제목 없음)"}
                            </button>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <span
                                    className={`px-2 py-0.5 rounded ${
                                        article.status === ARTICLE_STATUS_DRAFT
                                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                    }`}
                                >
                                    {ARTICLE_STATUS_LABELS[article.status] || article.status}
                                </span>
                                <span>
                                    {article.status === ARTICLE_STATUS_DRAFT
                                        ? `수정: ${article.updatedAt.toLocaleDateString("ko-KR")}`
                                        : `발행: ${article.publishedAt.toLocaleDateString("ko-KR")}`}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            <button
                                onClick={() => onEdit(article.articleId)}
                                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title="수정"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(article.articleId)}
                                disabled={isDeleting}
                                className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                title="삭제"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    {article.status !== ARTICLE_STATUS_DRAFT && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <ReactionStatsSection articleId={article.articleId} showCompact={true} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
