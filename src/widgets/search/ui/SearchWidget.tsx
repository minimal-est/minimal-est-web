import { useSearchParams } from "react-router-dom";
import { SearchForm } from "@/features/article-searching";
import { useSearchArticles } from "@/entities/article/lib";
import { ArticleList } from "@/entities/article/ui";
import { Spinner } from "@/shared/ui/base";

export const SearchWidget = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 0;

    const { data, isLoading, isError } = useSearchArticles(query, page);

    const handlePageChange = (newPage: number) => {
        setSearchParams({ q: query, page: newPage.toString() });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <SearchForm />
                <div className="mt-8">
                    <p className="text-red-600">검색 중 오류가 발생했습니다.</p>
                </div>
            </div>
        );
    }

    const articles = data?.content || [];
    const totalPages = data?.totalPages || 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <SearchForm />
            </div>

            {query && (
                <>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">검색 결과</h2>
                        <p className="text-gray-600">"{query}" 검색 결과: {data?.totalElements || 0}개</p>
                    </div>

                    {articles.length === 0 ? (
                        <p className="text-gray-600">검색 결과가 없습니다.</p>
                    ) : (
                        <>
                            <ArticleList articles={articles} />

                            {/* 페이지네이션 */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 0}
                                        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        이전
                                    </button>

                                    <span className="px-4 py-2">
                                        {page + 1} / {totalPages}
                                    </span>

                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page >= totalPages - 1}
                                        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        다음
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};
