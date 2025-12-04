import { X } from "lucide-react";
import type { ArticleSummary } from "@/entities/article/model/types";

interface ArticlePreviewModalProps {
    isOpen: boolean;
    article: ArticleSummary | null;
    action: "save" | "publish";
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

/**
 * 글 저장 또는 발행 전 미리보기 모달
 * ArticleCard로 글의 모양을 미리 보여주고 확인을 받습니다.
 */
export const ArticlePreviewModal = ({
    isOpen,
    article,
    action,
    onConfirm,
    onCancel,
    isLoading,
}: ArticlePreviewModalProps) => {
    if (!isOpen || !article) return null;

    const isPublish = action === "publish";
    const title = isPublish ? "발행할까요?" : "수정할까요?";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
                {/* 헤더 */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 미리보기 */}
                {/* <div className="max-h-80 overflow-y-auto px-6 py-4">
                    <div className="pointer-events-none">
                        <ArticleCard article={article} />
                    </div>
                </div> */}
                <div className="px-6 py-4">
                    <p>걱정마세요! 언제든지 수정이 가능합니다.</p>
                </div>

                {/* 버튼 영역 */}
                <div className="flex gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 rounded-lg bg-violet-600 px-4 py-2 font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
                    >
                        {isLoading ? "처리 중..." : "네"}
                    </button>
                </div>
            </div>
        </div>
    );
};
