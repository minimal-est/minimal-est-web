import { ArticleList } from "@/entities/article/ui";
import { useInfiniteRecommendArticles } from "@/entities/article/lib/hooks";
import { Skeleton } from "@/shared/ui/base";
import { useEffect, useRef } from "react";

export const ArticleFeed = () => {
    const {
        data,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteRecommendArticles(15);

    const observerTarget = useRef<HTMLDivElement>(null);

    // Intersection Observer로 바닥 감지
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // 모든 페이지의 아티클을 합치기
    const articles = data?.pages.flatMap(page => page.content) ?? [];

    if (isLoading) {
        return (
            <div className="w-full max-w-2xl mx-auto px-4 py-8">
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
            <div className="w-full max-w-2xl mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        아티클을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <ArticleList articles={articles} />

            {/* 무한스크롤 감지 요소 */}
            <div ref={observerTarget} className="py-8 flex justify-center">
                {isFetchingNextPage && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        더 불러오는 중...
                    </div>
                )}
                {!hasNextPage && articles.length > 0 && (
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                        모든 글을 불러왔습니다.
                    </div>
                )}
            </div>
        </div>
    );
};