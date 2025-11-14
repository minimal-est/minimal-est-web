import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { mockArticleSummaries } from "@/entities/article/model";
import { TiptapRenderer } from "@/shared/ui/TiptapRenderer";
import { Editor } from "@/shared/ui/Editor";
import type { JSONContent } from "@tiptap/core";
import { Edit2, X, Save } from "lucide-react";

export const ArticleDetailPage = () => {
    const { articleId } = useParams<{ penName: string; articleId: string }>();
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState<JSONContent[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const article = mockArticleSummaries.find((a) => a.articleId === articleId);

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    글을 찾을 수 없습니다
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    요청하신 글이 존재하지 않습니다.
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
        setEditTitle(article.title);
        setEditContent(article.content);
        setIsEditMode(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: API 호출로 수정 사항 저장
            console.log("글 수정:", { title: editTitle, content: editContent });
            alert("글이 수정되었습니다!");
            setIsEditMode(false);
        } catch (error) {
            console.error("수정 실패:", error);
            alert("글 수정에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setEditTitle("");
        setEditContent([]);
    };

    if (isEditMode) {
        return (
            <div className="w-full min-h-screen bg-white dark:bg-gray-900">
                {/* Edit Header */}
                <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <X size={20} />
                                <span className="font-medium">취소</span>
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                <Save size={18} />
                                {isSaving ? "저장 중..." : "저장"}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Edit Content */}
                <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="space-y-8">
                        {/* Title Input */}
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="글의 제목을 입력하세요..."
                                className="w-full text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none focus:outline-none"
                            />
                            <div className="h-1 w-12 bg-violet-600 rounded-full" />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-transparent dark:from-gray-700 dark:via-gray-600 dark:to-transparent" />

                        {/* Content Editor */}
                        <div className="space-y-4">
                            <Editor value={editContent} onChange={setEditContent} />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

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
                            <div className="flex flex-col">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {article.author.penName}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(article.completedAt)}
                                </p>
                            </div>
                        </div>
                        {/* Edit Button */}
                        <button
                            onClick={handleEditMode}
                            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="글 수정"
                        >
                            <Edit2 size={18} />
                            <span className="text-sm font-medium">수정</span>
                        </button>
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
