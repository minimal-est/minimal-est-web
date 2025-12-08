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
            <div className="relative w-full max-w-md bg-white dark:bg-gray-950">
                {/* 헤더 */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 미리보기 */}
                <div className="px-6 py-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">걱정마세요! 언제든지 수정이 가능합니다.</p>
                </div>

                {/* 버튼 영역 */}
                <div className="flex gap-3 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isLoading ? "처리 중..." : "네"}
                    </button>
                </div>
            </div>
        </div>
    );
};
