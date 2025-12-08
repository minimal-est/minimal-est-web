import { useBlogArticles } from "@/entities/article/lib/hooks";
import { ArticleList } from "@/entities/article/ui";

interface BlogArticleListWidgetProps {
    penName: string;
    limit?: number;
    showAuthor?: boolean;
}

export const BlogArticleListWidget = ({ penName, limit = 10, showAuthor = false }: BlogArticleListWidgetProps) => {
    const { data: articlesData, isLoading } = useBlogArticles(penName, 0, limit);

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    글을 불러오는 중...
                </p>
            </div>
        );
    }

    return (
        <ArticleList articles={articlesData?.content || []} showAuthor={showAuthor} />
    );
};
