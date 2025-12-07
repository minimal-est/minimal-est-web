import { useNavigate } from "react-router-dom";
import type { ArticleSummary } from "../model";

export interface ArticleNavigationCardProps {
    direction: 'prev' | 'next';
    article: ArticleSummary | null;
}

export const ArticleNavigationCard = ({ direction, article }: ArticleNavigationCardProps) => {
    const navigate = useNavigate();

    if (!article) return <div />;

    const isPrev = direction === "prev";
    const label = isPrev ? "이전글" : "다음글";

    return (
          <button
              onClick={() => navigate(`/articles/${article.author.penName}/${article.slug}`)}
              className={`p-3 flex items-start gap-1 w-full hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  isPrev ? "text-left" : " text-right flex-row-reverse"
              }`}
          >
              <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {label}
                  </p>
                  <h3 className="text-left text-sm font-semibold text-gray-900 dark:text-white line-clamp-4">
                      {article.title}
                  </h3>
              </div>
          </button>
    );
}

