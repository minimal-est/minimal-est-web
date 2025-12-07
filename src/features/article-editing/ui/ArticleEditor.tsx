import { useEffect } from "react";
import { Save, Send, Check, X } from "lucide-react";
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
        tags,
        tagInput,
        setTagInput,
        isLoading,
        isInitialLoading,
        error,
        success,
        handleSave,
        handlePublish,
        handleAddTag,
        handleRemoveTag,
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
        return <div className="flex items-center justify-center w-full h-screen"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" /></div>
    }

    return (
        <div className="max-w-prose mx-auto">
            {/* 헤더 */}
            <header className="backdrop-blur-sm bg-opacity-95">
            </header>

            {/* 메인(편집) */}
            <main className="mx-auto my-12">
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
                            className="w-full text-2xl sm:text-5xl font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none focus:outline-none resize-none overflow-hidden"
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
                    <hr />

                    {/* Content Editor */}
                    <div>
                        <TiptapEditorWidget value={content} onChange={setContent} />
                    </div>

                    {/* Tags Input */}
                    <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            태그 (선택 사항)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="태그를 입력하고 Enter를 누르세요"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-none hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                            >
                                추가
                            </button>
                        </div>

                        {/* Tags List */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-none border border-gray-300 dark:border-gray-600"
                                    >
                                        <span className="text-sm">{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(index)}
                                            className="hover:text-red-500 transition-colors p-0.5"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
        </div>
    );
};
