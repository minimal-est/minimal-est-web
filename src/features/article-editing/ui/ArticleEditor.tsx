import { useEffect } from "react";
import { ChevronLeft, Save, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { TiptapEditorWidget } from "@/widgets/tiptap-editor/ui";
import { useArticleEditor } from "../model/useArticleEditor";
import { ArticlePreviewModal } from "./ArticlePreviewModal";
import { ARTICLE_TITLE_MAX_LENGTH, ARTICLE_DESCRIPTION_MAX_LENGTH } from "@/shared/constants";

interface ArticleEditorProps {
    articleId?: string;
    isEditMode?: boolean;
}

export const ArticleEditor = ({ articleId, isEditMode = false }: ArticleEditorProps) => {
    const {
        title,
        setTitle,
        description,
        setDescription,
        content,
        setContent,
        isLoading,
        isInitialLoading,
        error,
        success,
        handleSave,
        handlePublish,
        blogId,
        articleId: currentArticleId,
        isEditMode: editorIsEditMode,
        isModalOpen,
        setIsModalOpen,
        modalAction,
        performSave,
        performPublish,
        previewArticle,
    } = useArticleEditor({
        articleId,
        isEditMode,
    });

    /**
     * 에러 메시지를 toast로 표시합니다.
     * error 상태가 변경될 때마다 실행됩니다.
     */
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    /**
     * 성공 메시지를 toast로 표시합니다.
     * success 상태가 변경될 때마다 실행됩니다.
     */
    useEffect(() => {
        if (success) {
            toast.success(success);
        }
    }, [success]);

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

    if (!currentArticleId) {
        return <div className="p-8 text-center">글 생성에 실패했습니다.</div>;
    }

    return (
        <>
            {/* 헤더 */}
            <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => window.location.href = "/"}
                            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">돌아가기</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* 메인(편집) */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
                <form id="article-form" className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    {/* Title Input */}
                    <div className="space-y-3">
                        <textarea
                            value={title}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                if (newValue.length > ARTICLE_TITLE_MAX_LENGTH) {
                                    return;
                                }
                                setTitle(newValue);
                            }}
                            placeholder="글의 제목을 입력하세요..."
                            rows={1}
                            className="w-full text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none focus:outline-none resize-none overflow-hidden"
                            onInput={(e) => {
                                const target = e.currentTarget;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                            }}
                        />
                        <div className="flex items-center justify-between">
                            <div className="h-1 w-12 bg-violet-600 rounded-full" />
                            <span className={`text-xs ${title.length === ARTICLE_TITLE_MAX_LENGTH ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                                {title.length} / {ARTICLE_TITLE_MAX_LENGTH}
                            </span>
                        </div>
                    </div>

                    {/* Description Input */}
                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                if (newValue.length > ARTICLE_DESCRIPTION_MAX_LENGTH) {
                                    return;
                                }
                                setDescription(newValue);
                            }}
                            placeholder="글의 간단한 설명을 작성하세요. 목록에서 미리보기로 보여집니다."
                            rows={2}
                            className="w-full text-lg text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none resize-none overflow-hidden focus:outline-none leading-relaxed"
                            onInput={(e) => {
                                const target = e.currentTarget;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                            }}
                        />
                        <div className="text-right">
                            <span className={`text-xs ${description.length === ARTICLE_DESCRIPTION_MAX_LENGTH ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                                {description.length} / {ARTICLE_DESCRIPTION_MAX_LENGTH}
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-transparent dark:from-gray-700 dark:via-gray-600 dark:to-transparent" />

                    {/* Content Editor */}
                    <div>
                        <TiptapEditorWidget value={content} onChange={setContent} />
                    </div>
                </form>
            </main>

            {/* 플로팅 하단 버튼 */}
            <div className="fixed bottom-8 right-8 z-40 flex gap-2">
                <div className="flex gap-2">
                    {editorIsEditMode ? (
                        // 수정 모드: 수정완료 버튼만
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-none hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                        >
                            <Check size={16} />
                            {isLoading ? "수정 중..." : "수정완료"}
                        </button>
                    ) : (
                        // 처음 글: 저장 + 발행 버튼
                        <>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-none hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                            >
                                <Save size={16} />
                                {isLoading ? "저장 중..." : "저장"}
                            </button>
                            <button
                                type="button"
                                onClick={handlePublish}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-none hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                            >
                                <Send size={16} />
                                {isLoading ? "발행 중..." : "발행"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 미리보기 모달 */}
            <ArticlePreviewModal
                isOpen={isModalOpen}
                article={previewArticle}
                action={modalAction}
                onConfirm={modalAction === "save" ? performSave : performPublish}
                onCancel={() => setIsModalOpen(false)}
                isLoading={isLoading}
            />
        </>
    );
};
