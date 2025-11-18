import { useNavigate } from "react-router-dom";
import { Trash2, Edit3, Plus } from "lucide-react";
import type { MyArticlesResponse, MyArticleSummary } from "@/entities/article/model/types";
import { ARTICLE_STATUS_LABELS, ARTICLE_STATUS_DRAFT } from "@/shared/constants";

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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                            제목
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                            상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                            수정일
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">
                            작업
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {articlesData.content.map((article: MyArticleSummary) => (
                        <tr
                            key={article.articleId}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                <button
                                    onClick={() => navigate(`/articles/${article.author.penName}/${article.articleId}`)}
                                    className="font-medium text-violet-600 dark:text-violet-400 hover:underline"
                                >
                                    {article.title || "(제목 없음)"}
                                </button>
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                        article.status === ARTICLE_STATUS_DRAFT
                                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                            : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                    }`}
                                >
                                    {ARTICLE_STATUS_LABELS[article.status] || article.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                {article.updatedAt.toLocaleDateString("ko-KR")}
                            </td>
                            <td className="px-6 py-4 text-sm text-right space-x-2">
                                <button
                                    onClick={() => onEdit(article.articleId)}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                >
                                    <Edit3 size={14} />
                                    수정
                                </button>
                                <button
                                    onClick={() => onDelete(article.articleId)}
                                    disabled={isDeleting}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={14} />
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
