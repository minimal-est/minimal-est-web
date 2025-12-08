import { useNavigate } from "react-router-dom";
import { Trash2, Edit3, Plus } from "lucide-react";
import { format } from "date-fns";
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

    const handleTitleClick = (article: MyArticleSummary) => {
        if (article.status === ARTICLE_STATUS_DRAFT) {
            // DRAFT: 편집 페이지로
            navigate(`/write/${article.articleId}`);
        } else {
            // PUBLISHED: 상세 페이지로 (slug 사용)
            navigate(`/articles/${article.author.penName}/${article.slug}`);
        }
    };

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
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity"
                >
                    <Plus size={16} />
                    새 글 작성
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {articlesData.content.map((article: MyArticleSummary) => (
                <div
                    key={article.articleId}
                    className="py-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <button
                                onClick={() => handleTitleClick(article)}
                                className="text-sm font-semibold text-gray-900 dark:text-white hover:opacity-60 line-clamp-2 text-left block w-full transition-opacity"
                            >
                                {article.title || "(제목 없음)"}
                            </button>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <span
                                    className={`px-2 py-0.5 ${
                                        article.status === ARTICLE_STATUS_DRAFT
                                            ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                                            : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                    }`}
                                >
                                    {ARTICLE_STATUS_LABELS[article.status] || article.status}
                                </span>
                                <span>
                                    {article.status === ARTICLE_STATUS_DRAFT
                                        ? `수정: ${format(article.updatedAt, "M.d HH:mm")}`
                                        : `발행: ${format(article.publishedAt, "M.d HH:mm")}`}
                                </span>
                                {article.status !== ARTICLE_STATUS_DRAFT && (
                                    <div className="ml-2">
                                        <ReactionStatsSection articleId={article.articleId} showCompact={true} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            <button
                                onClick={() => onEdit(article.articleId)}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title="수정"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(article.articleId)}
                                disabled={isDeleting}
                                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                title="삭제"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
