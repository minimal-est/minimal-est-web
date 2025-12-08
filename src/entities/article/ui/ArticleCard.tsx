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
    showAuthor?: boolean;
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
    showAuthor = true,
}: ArticleCardProps) => {
    const formatDate = (date: Date) => {
        return formatDistanceToNow(date, {
            addSuffix: true,
            locale: ko,
        });
    };

    return (
        <Link
            to={`/articles/${article.author.penName}/${article.slug}`}
            className="block transition-opacity hover:opacity-60 no-underline"
        >
            <article className="py-3 px-0 border-b border-gray-200 dark:border-gray-800">
                {showAuthor ? (
                    <div className="flex items-center gap-2 mb-2">
                        {/* Avatar - clickable profile link */}
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onClickCapture={(e) => {
                                if (e.target === e.currentTarget || (e.target as HTMLElement).closest('[data-profile-avatar]')) {
                                    window.location.href = `/b/${article.author.penName}`;
                                }
                            }}
                        >
                            <div data-profile-avatar>
                                <ProfileAvatar
                                    penName={article.author.penName}
                                    profileImageUrl={article.author.profileImageUrl}
                                    size="sm"
                                    clickable={true}
                                />
                            </div>
                        </div>
                        {/* Author Info */}
                        <div className="flex-1 flex flex-col gap-0 min-w-0">
                            <div className="font-semibold text-xs text-gray-900 truncate dark:text-white">
                                {article.author.penName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                                {formatDate(article.publishedAt)}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-2">
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDate(article.publishedAt)}
                        </div>
                    </div>
                )}

                {/* Content */}
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-2">
                    {article.title}
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5 mb-2">
                    {article.description}
                </p>

                <ReactionStatsDisplay
                    articleId={article.articleId}
                    stats={reactionStats}
                    myReactions={myReactions}
                    isLoading={isReactionLoading}
                    error={reactionError}
                    variant="compact"
                />
            </article>
        </Link>
    );
};