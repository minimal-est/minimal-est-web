import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { ArticleFiltersPanel, ArticleListTable, useArticleFilters } from "@/features/article-management";
import { useAuth } from "@/entities/user/lib";

export const ArticleManagePage = () => {
    const navigate = useNavigate();
    const { blogId } = useAuth();

    const { status, setStatus, searchInput, setSearchInput, handleSearch, page, setPage, articlesData, isLoading, error, handleDelete, isDeleting } = useArticleFilters(blogId || "");

    const handleEdit = (articleId: string) => {
        navigate(`/write/${articleId}`);
    };

    if (!blogId) {
        return <div className="p-8 text-center text-red-600">블로그 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="w-full min-h-screen bg-background flex flex-col">
            {/* 헤더 */}
            <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95">
                <div className="w-full max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate("/")}
                            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span className="text-sm font-medium">돌아가기</span>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">내 글 관리</h1>
                        <button
                            onClick={() => navigate("/articles/create")}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:opacity-90 transition-opacity font-medium"
                        >
                            <Plus size={16} />
                            새 글
                        </button>
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="w-full max-w-2xl mx-auto px-4 py-8 flex-1">
                {/* 필터 및 검색 */}
                <ArticleFiltersPanel
                    status={status}
                    setStatus={setStatus}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onSearch={handleSearch}
                />

                {/* 글 개수 */}
                {articlesData && (
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        총 <span className="font-semibold text-gray-900 dark:text-white">{articlesData.totalElements}</span>개의 글
                    </div>
                )}

                {/* 글 목록 */}
                <ArticleListTable
                    articlesData={articlesData}
                    isLoading={isLoading}
                    error={error}
                    isDeleting={isDeleting}
                    onEdit={handleEdit}
                    onDelete={(articleId) =>
                        handleDelete(articleId, {
                            onSuccess: () => {
                                toast.success("글이 삭제되었습니다.");
                            },
                            onError: () => {
                                toast.error("글 삭제에 실패했습니다.");
                            },
                        })
                    }
                />

                {/* 페이지네이션 */}
                {articlesData && articlesData.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            이전
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {page + 1} / {articlesData.totalPages}
                        </span>
                        <button
                            onClick={() => setPage(Math.min(articlesData.totalPages - 1, page + 1))}
                            disabled={page >= articlesData.totalPages - 1}
                            className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            다음
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};
