import type {ArticleSummary} from "@/entities/article/model";
import {Link} from "react-router-dom";

interface ArticleCardProps {
    article: ArticleSummary;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
    const formatDate = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;

        const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        return `${months[date.getMonth()]} ${date.getDate()}일`;
    };

    return (
        <Link
            to={`/${article.author.penName}/${article.articleId}`}
            className="block transition-all duration-200 hover:no-underline"
        >
            <article className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 transition-shadow duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {/* Header with Author Info */}
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm">
                        {article.author.penName.charAt(0).toUpperCase()}
                    </div>
                    {/* Author Info */}
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <div className="font-semibold text-sm text-gray-900 truncate dark:text-gray-100">
                            {article.author.penName}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(article.completedAt)}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">
                        {article.title}
                    </h2>
                    <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {article.description}
                    </p>
                </div>
            </article>
        </Link>
    );
};