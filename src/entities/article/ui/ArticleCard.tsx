import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ReactionStatsDisplay, type ArticleReactionStats, type MyReactionResponse } from "@/entities/article-reaction";
import type { ArticleSummary } from "@/entities/article/model";
import { ProfileAvatar } from "@/entities/blog/ui";
import { Link } from "react-router-dom";

interface ArticleCardProps {
    article: ArticleSummary;
    reactionStats?: ArticleReactionStats | null;
    myReactions?: MyReactionResponse | null;
    isReactionLoading?: boolean;
    reactionError?: string | null;
}

/**
 * 순수 UI 컴포넌트 - 반응 데이터는 props로 받음
 * 반응 데이터 fetching은 부모 컴포넌트에서 처리
 */
export const ArticleCard = ({
    article,
    reactionStats = null,
    myReactions = null,
    isReactionLoading = false,
    reactionError = null,
}: ArticleCardProps) => {
    const formatDate = (date: Date) => {
        return formatDistanceToNow(date, {
            addSuffix: true,
            locale: ko,
        });
    };

    return (
        <Link
            to={`/articles/${article.author.penName}/${article.articleId}`}
            className="block transition-all duration-200 hover:no-underline"
        >
            <article className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 transition-all duration-200 hover:translate-y-[-2px]">
                {/* Header with Author Info */}
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <ProfileAvatar
                        penName={article.author.penName}
                        profileImageUrl={article.author.profileImageUrl}
                        size="sm"
                    />
                    {/* Author Info */}
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="font-semibold text-sm text-gray-900 truncate dark:text-gray-100">
                            {article.author.penName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(article.publishedAt)}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                        {article.title}
                    </h2>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-300 line-clamp-2">
                        {article.description}
                    </p>
                </div>
                <div className="pt-1">
                    <ReactionStatsDisplay
                        articleId={article.articleId}
                        stats={reactionStats}
                        myReactions={myReactions}
                        isLoading={isReactionLoading}
                        error={reactionError}
                        variant="compact"
                    />
                </div>
            </article>
        </Link>
    );
};