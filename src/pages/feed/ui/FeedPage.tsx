import { DunggeunmoText } from "@/shared/ui";
import { ArticleFeed } from "@/widgets/article-feed/ui";
import { useEffect } from "react";

export const FeedPage = () => {
    // SEO 메타 태그 설정
    useEffect(() => {
        document.title = "모든 글 | Minimal-est Web";

        const updateMeta = (name: string, content: string) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        updateMeta('description', '다양한 분야의 흥미로운 글들을 만나보세요. 최신 글들을 무한스크롤로 탐색해보세요.');
        updateMeta('keywords', '블로그, 글, 기사, 미니멀리즘, 글쓰기');

        // Open Graph (소셜 미디어 공유)
        const updateOG = (property: string, content: string) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        updateOG('og:title', '모든 글 | Minimal-est Web');
        updateOG('og:description', '다양한 분야의 흥미로운 글들을 만나보세요.');
        updateOG('og:type', 'website');
        updateOG('og:url', window.location.href);

        return () => {
            // 클린업 (필요시)
        };
    }, []);

    return (
        <div className="w-full min-h-screen bg-white dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-12 px-4 text-center">
                <div className="flex justify-center items-center gap-1">
                    <DunggeunmoText className="text-right">
                        <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-gray-900 dark:text-white">
                            모든 글
                        </div>
                        <p className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400">
                            다양한 분야의 흥미로운 글들을 만나보세요
                        </p>
                    </DunggeunmoText>
                    <img className="w-40"
                        src="/img/typing_man.png"
                    />
                </div>
            </header>
            <main className="py-12">
                <ArticleFeed />
            </main>
        </div>
    );
};