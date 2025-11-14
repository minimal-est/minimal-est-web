import { ArticleFeed } from "@/widgets/article-feed/ui";

export const FeedPage = () => {
    return (
        <div className="w-full min-h-screen bg-white dark:bg-gray-900">
            <header className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-12 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                    모든 글
                </h1>
                <p className="text-lg md:text-xl opacity-95 font-medium">
                    다양한 분야의 흥미로운 글들을 만나보세요
                </p>
            </header>
            <main className="py-12">
                <ArticleFeed />
            </main>
        </div>
    );
};