import { DunggeunmoText } from "@/shared/ui";
import { ArticleFeed } from "@/widgets/article-feed/ui";
import { Helmet } from "react-helmet-async";

export const FeedPage = () => {

    return (
        <>
            <Helmet>
                <title>모든 글 | Minimal-est</title>
                <meta name="description" content="다양한 분야의 흥미로운 글들을 만나보세요. 최신 글들을 무한스크롤로 탐색해보세요." />
                <meta name="keywords" content="블로그, 글, 기사, 미니멀리즘, 글쓰기" />
                <meta property="og:title" content="모든 글 | Minimal-est" />
                <meta property="og:description" content="다양한 분야의 흥미로운 글들을 만나보세요." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
            </Helmet>
            <div className="w-full min-h-screen bg-white dark:bg-gray-900">
                <header className="bg-gradient-to-br from-white to-gray-50 dark:bg-gradient-to-br dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 py-12 px-4 text-center">
                <div className="flex justify-center items-center gap-1">
                    <DunggeunmoText className="">
                        <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-gray-900 dark:text-white">
                            모든 글
                        </div>
                        <p className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400">
                            다양한 분야의 흥미로운 글들을 만나보세요
                        </p>
                    </DunggeunmoText>
                    {/* <img className="w-40 dark:invert"
                        src="/img/pen.png"
                    /> */}
                </div>
            </header>
                <main className="py-12">
                    <ArticleFeed />
                </main>
            </div>
        </>
    );
};