import { ArticleList } from "@/entities/article/ui";
import { mockArticleSummaries } from "@/entities/article/model";

export const ArticleFeed = () => {
    // For now, use mock data. Later replace with useRecommendArticles()
    // const { data: articles = [], isLoading, error } = useRecommendArticles();

    const articles = mockArticleSummaries;
    const isLoading = false;
    const error = null;

    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        아티클을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <ArticleList articles={articles} />
        </div>
    );
};