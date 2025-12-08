import { X, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Bookmark } from "../model";

interface BookmarkItemProps {
    bookmark: Bookmark;
    articleTitle?: string;
    authorPenName?: string;
    isDragging?: boolean;
    onRemove?: (bookmarkId: string) => void;
}

export const BookmarkItem = ({
    bookmark,
    articleTitle = "제목 없음",
    authorPenName,
    isDragging = false,
    onRemove,
}: BookmarkItemProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (!authorPenName) {
            toast.error('작가 정보를 찾을 수 없습니다');
            return;
        }

        const identifier = bookmark.articleSlug;
        navigate(`/articles/${authorPenName}/${identifier}`);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!authorPenName) {
            toast.error('작가 정보를 찾을 수 없습니다');
            return;
        }

        const baseUrl = window.location.origin;
        const identifier = bookmark.articleSlug;
        const articleUrl = `${baseUrl}/articles/${authorPenName}/${identifier}`;

        navigator.clipboard.writeText(articleUrl).then(() => {
            toast.success('링크가 복사되었습니다');
        }).catch(() => {
            toast.error('링크 복사에 실패했습니다');
        });
    };

    return (
        <div
            onClick={handleClick}
            className={`py-3 px-0 border-b border-gray-200 dark:border-gray-800 cursor-pointer transition-opacity hover:opacity-60 ${
                isDragging ? 'opacity-50' : ''
            }`}
            draggable
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-gray-900 dark:text-white truncate">
                        {articleTitle}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                        {authorPenName}
                    </p>
                </div>
                <div
                    className="flex items-center gap-1.5 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleShare}
                        className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                        title="링크 복사"
                    >
                        <Share2 size={14} />
                    </button>
                    {onRemove && (
                        <button
                            onClick={() => onRemove(bookmark.id)}
                            className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                            title="제거"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
