import { useParams, useNavigate } from "react-router-dom";
import { useSingleArticle } from "@/entities/article/lib";
import { TiptapRenderer } from "@/shared/ui/TiptapRenderer";
import { Edit2 } from "lucide-react";
import { useAuthStore } from "@/entities/user/lib";

export const ArticleDetailPage = () => {
    const { penName, articleId } = useParams<{ penName: string; articleId: string }>();
    const navigate = useNavigate();
    const { blogId, penName: myPenName } = useAuthStore();

    const { data: article, isLoading, error } = useSingleArticle(
        { penName: penName || "", articleId: articleId || "" },
        !!(penName && articleId)
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mb-4" />
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    글을 찾을 수 없습니다
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {error ? "글을 불러올 수 없습니다." : "요청하신 글이 존재하지 않습니다."}
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    const formatDate = (date: Date) => {
        const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        return `${months[date.getMonth()]} ${date.getDate()}일`;
    };

    const handleEditMode = () => {
        if (!articleId) {
            alert("글 ID를 찾을 수 없습니다.");
            return;
        }
        navigate(`/write/${articleId}`, { state: { authorPenName: article?.author.penName } });
    };


    return (
        <div className="w-full min-h-screen bg-white dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/")}
                        className="text-violet-600 dark:text-violet-400 hover:underline mb-6 font-medium"
                    >
                        ← 목록으로
                    </button>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                        {article.title}
                    </h1>

                    {/* Author Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-lg">
                                {article.author.penName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {article.author.penName}
                                    </p>
                                    {article.status === 'DRAFT' && (
                                        <span className="inline-block px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded-full">
                                            발행되지 않음
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(article.publishedAt)}
                                </p>
                            </div>
                        </div>
                        {/* Edit Button - 자신의 글일 때만 표시 */}
                        {myPenName === article.author.penName && (
                            <button
                                onClick={handleEditMode}
                                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="글 수정"
                            >
                                <Edit2 size={18} />
                                <span className="text-sm font-medium">수정</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-4 py-12">
                <div className="prose dark:prose-invert max-w-none">
                    <TiptapRenderer nodes={article.content} />
                </div>
            </main>
        </div>
    );
};
