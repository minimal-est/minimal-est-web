import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "sonner";
import { useEffect } from "react";
import { useSingleArticle } from "@/entities/article/lib";
import { TiptapRenderer } from "@/shared/ui/TiptapRenderer";
import { Edit2, Share2 } from "lucide-react";
import { useAuth } from "@/entities/user/lib";
import { ReactionStatsSection } from "@/features/article-reacting";
import { ProfileAvatar } from "@/entities/blog/ui";
import { ArticleCommentsWidget } from "@/widgets/article-comments";
import { useBookmarkAdding, BookmarkAddFloatingButton, BookmarkAddModal } from "@/features/bookmark-adding";
import { ArticleNavigationWidget } from "@/widgets/article-navigation/ui";

export const ArticleDetailPage = () => {
    const { penName, articleId } = useParams<{ penName: string; articleId: string }>();
    const navigate = useNavigate();
    const { penName: myPenName } = useAuth();

    const { data: article, isLoading, error } = useSingleArticle(
        { penName: penName || "", articleId: articleId || "" },
        !!(penName && articleId)
    );

    const { isSignedIn } = useAuth();

    // SEO 메타 태그 설정
    useEffect(() => {
        if (!article) return;

        document.title = `${article.title} | Minimal-est Web`;

        const updateMeta = (name: string, content: string) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        const description = article.description || article.title;
        updateMeta('description', description);
        updateMeta('author', article.author.penName);

        // Open Graph (소셜 미디어 공유)
        const updateOG = (property: string, content: string) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        const baseUrl = window.location.origin;
        const articleUrl = `${baseUrl}/articles/${penName}/${articleId}`;

        updateOG('og:title', article.title);
        updateOG('og:description', description);
        updateOG('og:type', 'article');
        updateOG('og:url', articleUrl);
        updateOG('article:author', article.author.penName);
        updateOG('article:published_time', article.publishedAt.toISOString());

        return () => {
            // 클린업
        };
    }, [article, penName, articleId]);

    const bookmarkAdding = useBookmarkAdding({
        collectionId: '',
    });

    const handleBookmarkClick = () => {
        if (!isSignedIn) {
            toast.error('북마크는 로그인 후 사용 가능합니다');
            return;
        }
        bookmarkAdding.setIsOpen(true);
    };

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

    const formatDateTime = (date: Date) => {
        return format(date, "M월 d일 H:mm", { locale: ko });
    };


    const handleEditMode = () => {
        if (!articleId) {
            toast.error("글 ID를 찾을 수 없습니다.");
            return;
        }
        navigate(`/write/${articleId}`, { state: { authorPenName: article?.author.penName } });
    };

    const handleShare = () => {
        if (!penName || !articleId) {
            toast.error("링크 복사에 실패했습니다.");
            return;
        }

        const baseUrl = window.location.origin;
        const articleUrl = `${baseUrl}/articles/${penName}/${articleId}`;

        navigator.clipboard.writeText(articleUrl).then(() => {
            toast.success('링크가 복사되었습니다');
        }).catch(() => {
            toast.error('링크 복사에 실패했습니다');
        });
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
                    <h2 className="text-2xl">
                        {article.description}
                    </h2>

                    <div>
                        <ReactionStatsSection
                            showCompact={true}
                            articleId={article.articleId}
                        />
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="">
                                <ProfileAvatar
                                    penName={article.author.penName}
                                    profileImageUrl={article.author.profileImageUrl}
                                    size="sm"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {article.author.penName}
                                    </p>
                                    {article.status === 'DRAFT' && (
                                        <span className="inline-block px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded-full">
                                            발행되지 않음
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                                    <p>발행일 ・ {formatDateTime(article.publishedAt)}</p>
                                    {article.updatedAt > article.publishedAt && (
                                        <p className="text-xs">마지막 수정일 ・ {formatDateTime(article.updatedAt)}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="링크 복사"
                            >
                                <Share2 size={18} />
                                <span className="text-sm font-medium">공유</span>
                            </button>

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
                </div>
            </header>

            {/* Content */}
            <article className="max-w-3xl mx-auto px-4 py-12">
                <div className="prose dark:prose-invert max-w-none">
                    <TiptapRenderer nodes={article.content} />
                </div>
            </article>

            {/* Prev And Next Navigator */}
            <ArticleNavigationWidget
                articleId={article.articleId}
            />

            {/* Reactions Footer */}
            <footer className="flex justify-center">
                <div className="max-w-3xl px-4 py-8 w-full">
                    <ReactionStatsSection
                        articleId={article.articleId}
                        showCompact={false}
                    />
                </div>
            </footer>

            {/* Comments Section */}
            <section className="bg-gray-50 dark:bg-gray-800 py-12">
                <div className="max-w-3xl mx-auto px-4">
                    <ArticleCommentsWidget articleId={article.articleId} />
                </div>
            </section>

            {/* Floating Bookmark Button */}
            <BookmarkAddFloatingButton
                isLoading={bookmarkAdding.isLoading}
                onClick={handleBookmarkClick}
            />

            {/* Bookmark Add Modal */}
            {isSignedIn &&
                <BookmarkAddModal
                    isOpen={bookmarkAdding.isOpen}
                    isLoading={bookmarkAdding.isLoading}
                    articleId={articleId}
                    onClose={() => bookmarkAdding.setIsOpen(false)}
                    onAdd={async (articleIdParam, collectionIdParam) => {
                        await bookmarkAdding.addBookmark(articleIdParam, collectionIdParam);
                    }}
                />
            }
        </div>
    );
};
