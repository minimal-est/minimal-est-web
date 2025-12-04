import { useNavigate } from "react-router-dom";
import type { ArticleSummary } from "../model";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ArticleNavigationCardProps {
    direction: 'prev' | 'next';
    article: ArticleSummary | null;
}

export const ArticleNavigationCard = ({ direction, article }: ArticleNavigationCardProps) => {
    const navigate = useNavigate();

    if (!article) return <div />;

    const isPrev = direction === "prev";
    const label = isPrev ? "이전글" : "다음글";
    const Icon = isPrev ? ChevronLeft : ChevronRight;

    return (
          <button
              onClick={() => navigate(`/articles/${article.author.penName}/${article.articleId}`)}
              className={`flex items-start gap-1 w-full ${
                  isPrev ? "text-left" : " text-right flex-row-reverse"
              }`}
          >
              <Icon className="text-violet-600 dark:text-violet-400 flex-shrink-0 mt-1" />
              <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                      {label}
                  </p>
                  <h3 className="text-left text-sm font-semibold text-gray-900 dark:text-white line-clamp-4">
                      {article.title}
                  </h3>
              </div>
          </button>
    );
}

