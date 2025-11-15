import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trash2, Edit3, Plus } from "lucide-react";
import { useMyArticles, useDeleteArticle } from "@/entities/article/lib";
import { useAuthStore } from "@/entities/user/lib";
import type { ArticleStatusFilter } from "@/entities/article/model/types";

const STATUS_LABELS: Record<string, string> = {
    DRAFT: "작성 중",
    PUBLISHED: "발행됨",
};

export const ArticleManagePage = () => {
    const navigate = useNavigate();
    const { blogId } = useAuthStore();
    const [status, setStatus] = useState<ArticleStatusFilter>("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");

    const { data: articlesData, isLoading, error } = useMyArticles(
        blogId || "",
        status,
        search,
        page,
        10
    );
    const { mutate: deleteArticleMutate, isPending: isDeleting } = useDeleteArticle();

    useEffect(() => {
        setPage(0); // 필터 변경 시 첫 페이지로
    }, [status, search]);

    const handleSearch = () => {
        setSearch(searchInput);
    };

    const handleDelete = (articleId: string) => {
        if (!blogId) return;
        if (confirm("이 글을 삭제하시겠습니까?")) {
            deleteArticleMutate(
                { blogId, articleId },
                {
                    onSuccess: () => {
                        alert("글이 삭제되었습니다.");
                    },
                    onError: () => {
                        alert("글 삭제에 실패했습니다.");
                    },
                }
            );
        }
    };

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
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="space-y-4">
                        {/* 상태 필터 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                상태
                            </label>
                            <div className="flex gap-3">
                                {["ALL", "DRAFT", "PUBLISHED"].map((statusOption) => (
                                    <button
                                        key={statusOption}
                                        onClick={() => setStatus(statusOption as ArticleStatusFilter)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            status === statusOption
                                                ? "bg-violet-600 text-white"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                    >
                                        {statusOption === "ALL"
                                            ? "전체"
                                            : statusOption === "DRAFT"
                                            ? "작성 중"
                                            : "발행됨"}
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
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder="검색할 제목을 입력하세요..."
                                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-violet-600"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                                >
                                    검색
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 글 목록 */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">글을 로드 중입니다...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600">
                        <p>글 목록을 불러올 수 없습니다.</p>
                    </div>
                ) : !articlesData || articlesData.content.length === 0 ? (
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
                ) : (
                    <>
                        {/* 테이블 */}
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
                                    {articlesData.content.map((article: typeof articlesData.content[number]) => (
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
                                                        article.status === "DRAFT"
                                                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                                            : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                    }`}
                                                >
                                                    {STATUS_LABELS[article.status] || article.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {article.updatedAt.toLocaleDateString("ko-KR")}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right space-x-2">
                                                <button
                                                    onClick={() => handleEdit(article.articleId)}
                                                    className="inline-flex items-center gap-1 px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <Edit3 size={14} />
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.articleId)}
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
                    </>
                )}
            </main>
        </div>
    );
};
