import { ArticleList } from "@/entities/article/ui";
import { useRecommendArticles } from "@/entities/article/lib/hooks";
import { Skeleton } from "@/shared/ui/base";

export const ArticleFeed = () => {
    const { data: articles = [], isLoading, error } = useRecommendArticles();

    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 py-8">
                <div>
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i}/>
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