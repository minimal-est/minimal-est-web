import { usePrevAndNextArticles } from "@/entities/article/lib/hooks";
import { ArticleNavigationCard } from "@/entities/article/ui";

interface ArticleNavigationWidgetProps {
    articleId: string;
}

export const ArticleNavigationWidget = ({ articleId }: ArticleNavigationWidgetProps) => {
    const { data: prevAndNextArticles } = usePrevAndNextArticles(articleId);

    if (!prevAndNextArticles || (!prevAndNextArticles.prevArticleSummary && !prevAndNextArticles.nextArticleSummary)) {
        return null;
    }

    return (
        <section className="bg-white dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-3xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ArticleNavigationCard 
                        direction="prev"
                        article={prevAndNextArticles.prevArticleSummary}
                    />
                    <ArticleNavigationCard 
                        direction="next"
                        article={prevAndNextArticles.nextArticleSummary}
                    />
                </div>
            </div>
        </section>
    )
}