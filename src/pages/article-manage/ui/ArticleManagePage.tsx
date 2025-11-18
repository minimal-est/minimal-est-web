import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { ArticleFiltersPanel, ArticleListTable, useArticleFilters } from "@/features/article-management";
import { useAuthStore } from "@/entities/user/lib";

export const ArticleManagePage = () => {
    const navigate = useNavigate();
    const { blogId } = useAuthStore();

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
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate("/")}
                            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">목록으로</span>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">내 글 관리</h1>
                        <button
                            onClick={() => navigate("/articles/create")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                        >
                            <Plus size={18} />
                            새 글 작성
                        </button>
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                {/* 필터 및 검색 */}
                <ArticleFiltersPanel
                    status={status}
                    setStatus={setStatus}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onSearch={handleSearch}
                />

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
                    <div className="mt-6 flex justify-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            이전
                        </button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: articlesData.totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                                        page === i
                                            ? "bg-violet-600 text-white"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(Math.min(articlesData.totalPages - 1, page + 1))}
                            disabled={page >= articlesData.totalPages - 1}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};
