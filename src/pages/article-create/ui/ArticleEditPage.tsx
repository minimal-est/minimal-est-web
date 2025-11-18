import { useParams } from "react-router-dom";
import { ArticleEditor } from "@/features/article-editing";

interface ArticleEditPageProps {
    isEditMode: boolean;
}

export const ArticleEditPage = ({ isEditMode = false }: ArticleEditPageProps) => {
    const { articleId } = useParams<{ articleId?: string }>();

    return (
        <div className="w-full min-h-screen bg-background flex flex-col">
            <ArticleEditor articleId={articleId} isEditMode={isEditMode} />
        </div>
    );
};
