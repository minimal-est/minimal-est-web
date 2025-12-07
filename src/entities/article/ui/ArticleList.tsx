import type { ArticleSummary } from "@/entities/article/model";
import { ArticleCard } from "@/entities/article/ui/ArticleCard.tsx";

interface ArticleListProps {
    articles: ArticleSummary[];
}

/**
 * 글 목록 - 각 글의 반응 데이터를 fetching하고 ArticleCard에 전달
 */
export const ArticleList = ({ articles }: ArticleListProps) => {
    if (articles.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg">표시할 글이 없어요!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 max-w-2xl">
            {articles.map((article) => (
                <ArticleCardWithReactions key={article.articleId} article={article} />
            ))}
        </div>
    );
};

/**
 * ArticleCard + 반응 데이터 로딩을 조합한 컴포넌트
 */
const ArticleCardWithReactions = ({ article }: { article: ArticleSummary }) => {
    return (
        <ArticleCard
            article={article}
            reactionStats={article.reactionStats}
        />
    );
};