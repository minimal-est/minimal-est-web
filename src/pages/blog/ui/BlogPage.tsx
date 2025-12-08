import { BlogAboutWidget } from "@/widgets/blog-about/ui/BlogAboutWidget"
import { BlogAuthorWidget } from "@/widgets/blog-author/ui/BlogAuthorWidget";
import { BlogArticleListWidget } from "@/widgets/blog-article-list/ui";
import { useParams } from "react-router-dom";

export const BlogPage = () => {
    const { penName } = useParams<{penName: string}>();
    if (!penName || penName.length < 2) {
        throw new Error("올바르지 않은 블로그");
    }

    return (
        <>
            <div className="w-full py-8 px-4 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-2xl mx-auto flex flex-col md:flex-row md:gap-12">
                    <div className="flex-1">
                        <BlogAboutWidget penName={penName} />
                    </div>
                    <div className="md:flex-shrink-0 mt-6 md:mt-0">
                        <BlogAuthorWidget penName={penName} />
                    </div>
                </div>
            </div>

            <div className="w-full py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <BlogArticleListWidget penName={penName} limit={10} showAuthor={false} />
                </div>
            </div>
        </>
    )
}