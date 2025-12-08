import { DunggeunmoText } from "@/shared/ui";
import { ArticleFeed } from "@/widgets/article-feed/ui";
import { Helmet } from "react-helmet-async";

export const FeedPage = () => {

    return (
        <>
            <Helmet>
                <title>모든 글 | Minimal-est</title>
                <meta name="description" content="다양한 분야의 흥미로운 글들을 만나보세요. 최신 글들을 무한스크롤로 탐색해보세요." />
                <meta name="keywords" content="블로그, 글, 기사, 글쓰기, 회고" />
                <meta property="og:title" content="모든 글 | Minimal-est" />
                <meta property="og:description" content="다양한 분야의 흥미로운 글들을 만나보세요." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
            </Helmet>
            <div className="w-full min-h-screen bg-white dark:bg-gray-950">
                <header
                    className="border-b border-gray-200 dark:border-gray-800 py-12 px-4 bg-cover bg-center relative"
                    style={{
                        backgroundImage: "url('/img/explore_background.png')"
                    }}
                >
                    {/* 오버레이 - 라이트모드 흰색 불투명, 다크모드 흰색 반전 */}
                    <div className="absolute inset-0 bg-white opacity-70 dark:bg-white dark:opacity-25 pointer-events-none" />
                    <div className="max-w-2xl mx-auto text-center relative z-10">
                        <DunggeunmoText>
                            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                                모든 글
                            </h1>
                            <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300">
                                다양한 분야의 흥미로운 글들을 만나보세요
                            </p>
                        </DunggeunmoText>
                    </div>
                </header>
                <main className="py-8">
                    <ArticleFeed />
                </main>
            </div>
        </>
    );
};