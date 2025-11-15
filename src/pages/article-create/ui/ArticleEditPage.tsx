import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { JSONContent } from "@tiptap/core";
import { ChevronLeft, Save, Send } from "lucide-react";
import { TiptapEditorWidget } from "@/widgets/tiptap-editor/ui";
import { completeArticle, createArticle, updateArticle, fetchSingleArticle } from "@/entities/article/api";
import { articleKeys } from "@/entities/article/lib";
import { useAuthStore } from "@/entities/user/lib";

interface ArticleEditPageProps {
    isEditMode: boolean;
}

export const ArticleEditPage = ({ isEditMode = false }: ArticleEditPageProps) => {
    const { articleId: urlArticleId } = useParams<{ articleId?: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { blogId, penName } = useAuthStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState<JSONContent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(!!urlArticleId);
    const [error, setError] = useState<string | null>(null);

    // 새 글 생성 및 리다이렉트
    useEffect(() => {
        if (isEditMode || !blogId) return;

        const createAndRedirect = async () => {
            try {
                const result = await createArticle(blogId);
                navigate(`/write/${result.articleId}`, { replace: true });
            } catch (err) {
                setError("글 생성에 실패하였습니다.");
                console.error(err);
                setIsInitialLoading(false);
            }
        };

        createAndRedirect();
    }, [blogId, urlArticleId, navigate, isEditMode]);

    useEffect(() => {
        if (!urlArticleId || !penName) return;

        const loadArticle = async () => {
            try {
                const article = await fetchSingleArticle({ penName, articleId: urlArticleId });
                setTitle(article.title);
                setDescription(article.description);
                setContent(article.content);
            } catch (err) {
                setError("글을 불러올 수 없습니다.");
                console.error(err);
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadArticle();
    }, [urlArticleId, penName, isEditMode]);

    const validateArticle = (): boolean => {
        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return false;
        }

        if (!description.trim()) {
            alert("설명을 입력해주세요.");
            return false;
        }

        if (content.length === 0) {
            alert("내용을 입력해주세요.");
            return false;
        }

        return true;
    };

    const handleSave = async (e: React.FormEvent) => {
        if (!blogId || !urlArticleId) {
            alert("유효한 글이나 블로그가 아닙니다.");
            navigate("/");
            return;
        }

        e.preventDefault();

        if (!validateArticle()) {
            return;
        }

        setIsLoading(true);

        try {
            await updateArticle(blogId, urlArticleId, title, content, description);
            await queryClient.invalidateQueries({ queryKey: articleKeys.all });
            alert("글이 저장되었습니다!");

            // 수정 모드일 경우 상세페이지로 이동
            if (isEditMode && penName) {
                navigate(`/articles/${penName}/${urlArticleId}`);
            }
        } catch (error: any) {
            setError(error?.response?.data?.detail || "글 저장에 실패했습니다.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async (e: React.FormEvent) => {
        if (!blogId || !urlArticleId) {
            alert("유효한 글이나 블로그가 아닙니다.");
            navigate("/");
            return;
        }

        e.preventDefault();

        if (!validateArticle()) {
            return;
        }

        setIsLoading(true);

        try {
            await updateArticle(blogId, urlArticleId, title, content, description);
            await completeArticle(blogId, urlArticleId);
            await queryClient.invalidateQueries({ queryKey: articleKeys.all });

            alert("글이 발행되었습니다!");
            navigate("/");
        } catch (error: any) {
            setError(error?.response?.data?.detail || "글 발행에 실패했습니다.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!blogId) {
        return <div className="p-8 text-center">블로그 정보를 불러올 수 없습니다.</div>;
    }

    if (isInitialLoading) {
        return (
            <div className="w-full min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">글을 준비 중입니다...</p>
                </div>
            </div>
        );
    }

    if (!urlArticleId) {
        return <div className="p-8 text-center">글 생성에 실패했습니다.</div>;
    }

    return (
        <div className="w-full min-h-screen bg-background flex flex-col">
            {/* 헤더 */}
            <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate("/")}
                            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">목록으로</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* 메인(편집) */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                        {error}
                    </div>
                )}
                <form id="article-form" className="space-y-8">
                    {/* Title Input */}
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="글의 제목을 입력하세요..."
                            className="w-full text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none focus:outline-none"
                        />
                        <div className="h-1 w-12 bg-violet-600 rounded-full" />
                    </div>

                    {/* Description Input */}
                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="글의 간단한 설명을 작성하세요. 목록에서 미리보기로 보여집니다."
                            rows={2}
                            className="w-full text-lg text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none resize-none focus:outline-none leading-relaxed"
                        />
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-transparent dark:from-gray-700 dark:via-gray-600 dark:to-transparent" />

                    {/* Content Editor */}
                    <div>
                        <TiptapEditorWidget value={content} onChange={setContent} />
                    </div>
                </form>
            </main>

            {/* 고정된 하단 버튼 */}
            <div className="sticky bottom-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
                <div className="max-w-3xl mx-auto flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        <Save size={18} />
                        {isLoading ? "저장 중..." : "저장"}
                    </button>
                    <button
                        type="button"
                        onClick={handlePublish}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        <Send size={18} />
                        {isLoading ? "발행 중..." : "발행"}
                    </button>
                </div>
            </div>
        </div>
    );
};
