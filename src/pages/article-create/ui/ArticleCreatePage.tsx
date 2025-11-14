import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { JSONContent } from "@tiptap/core";
import { ChevronLeft, Save } from "lucide-react";
import { TiptapEditorWidget } from "@/widgets/tiptap-editor/ui";

export const ArticleCreatePage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState<JSONContent[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!description.trim()) {
            alert("설명을 입력해주세요.");
            return;
        }

        if (content.length === 0) {
            alert("내용을 입력해주세요.");
            return;
        }

        setIsLoading(true);

        try {
            // TODO: API 호출로 글 저장
            // const response = await fetch('/api/articles', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ title, description, content })
            // });
            // const data = await response.json();

            console.log("글 저장:", { title, description, content });
            alert("글이 저장되었습니다!");
            navigate("/");
        } catch (error) {
            console.error("저장 실패:", error);
            alert("글 저장에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

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
                <form id="article-form" onSubmit={handleSubmit} className="space-y-8">
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
                        type="submit"
                        form="article-form"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        <Save size={18} />
                        {isLoading ? "저장 중..." : "발행"}
                    </button>
                </div>
            </div>
        </div>
    );
};
