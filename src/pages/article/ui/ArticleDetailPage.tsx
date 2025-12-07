import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "sonner";
import { useSingleArticleBySlug } from "@/entities/article/lib";
import { TiptapRenderer } from "@/shared/ui/TiptapRenderer";
import { Edit2, Share2 } from "lucide-react";
import { useAuth } from "@/entities/user/lib";
import { ReactionStatsSection } from "@/features/article-reacting";
import { ProfileAvatar } from "@/entities/blog/ui";
import { ArticleCommentsWidget } from "@/widgets/article-comments";
import { useBookmarkAdding, BookmarkAddFloatingButton, BookmarkAddModal } from "@/features/bookmark-adding";
import { ArticleNavigationWidget } from "@/widgets/article-navigation/ui";
import { Helmet } from "react-helmet-async";

export const ArticleDetailPage = () => {
    const { penName, slug } = useParams<{ penName: string; slug: string }>();
    const navigate = useNavigate();
    const { penName: myPenName } = useAuth();

    const { data: article, isLoading, error } = useSingleArticleBySlug(
        penName || "",
        slug || "",
        !!(penName && slug)
    );

    const { isSignedIn } = useAuth();

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
        if (!article?.articleId) {
            toast.error("글 ID를 찾을 수 없습니다.");
            return;
        }
        navigate(`/write/${article.articleId}`, { state: { authorPenName: article?.author.penName } });
    };

    const handleShare = () => {
        if (!penName || !slug) {
            toast.error("링크 복사에 실패했습니다.");
            return;
        }

        const baseUrl = window.location.origin;
        const articleUrl = `${baseUrl}/articles/${penName}/${slug}`;

        navigator.clipboard.writeText(articleUrl).then(() => {
            toast.success('링크가 복사되었습니다');
        }).catch(() => {
            toast.error('링크 복사에 실패했습니다');
        });
    };


    return (
        <>
            <Helmet>
                <title>{article.title} | Minimal-est</title>
                <meta name="description" content={article.description || article.title} />
                <meta name="author" content={article.author.penName} />
                <link rel="canonical" href={`${window.location.origin}/articles/${penName}/${slug}`} />
                {/* Open Graph (소셜 미디어 공유) 태그 */}
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.description || article.title} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`${window.location.origin}/articles/${penName}/${slug}`} />
                {/*<meta property="og:image" content={article.thumbnailUrl || '기본_이미지_URL'} />*/}
                <meta property="article:author" content={article.author.penName} />
                <meta property="article:published_time" content={article.publishedAt.toISOString()} />
                {article.tags && <meta property="article:tag" content={article.tags.join(', ')} />}
            </Helmet>
            <div className="w-full bg-white dark:bg-gray-900">
                <div className="max-w-prose mx-auto">
                    {/* Header */}
                    <header className="border-b border-gray-200 dark:border-gray-700">
                        <div className="mx-auto py-8">
                            {/* Back Button */}
                            <button
                                onClick={() => navigate("/")}
                                className="text-violet-600 dark:text-violet-400 hover:underline mb-6 font-medium"
                            >
                                ← 목록으로
                            </button>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                {article.title}
                            </h1>
                            <h2 className="text-2xl">
                                {article.description}
                            </h2>

                            <div className="pt-4">
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
                    <article className="max-w-prose mx-auto py-12">
                        <div className="prose dark:prose-invert">
                            <TiptapRenderer nodes={article.content} />
                        </div>

                        {/* Tags */}
                        {Array.isArray(article.tags) && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-8">
                                {article.tags.map((tag: string, index: number) => (
                                    <span
                                        key={`${tag}-${index}`}
                                        className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </article>

                    {/* Prev And Next Navigator */}
                    <div>
                        <ArticleNavigationWidget
                            articleId={article.articleId}
                        />
                    </div>

                    {/* Reactions Footer */}
                    <footer className="flex justify-center">
                        <div className="py-5">
                            <ReactionStatsSection
                                articleId={article.articleId}
                                showCompact={false}
                            />
                        </div>
                    </footer>

                    {/* Comments Section */}
                    <section className="bg-gray-50 dark:bg-gray-800 py-12">
                        <div className="mx-auto px-4">
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
                            articleId={article?.articleId || ""}
                            onClose={() => bookmarkAdding.setIsOpen(false)}
                            onAdd={async (articleIdParam, collectionIdParam) => {
                                await bookmarkAdding.addBookmark(articleIdParam, collectionIdParam);
                            }}
                        />
                    }
                </div>
            </div>
        </>
    );
};
