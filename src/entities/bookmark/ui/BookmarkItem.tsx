import { Trash2, Bookmark as BookmarkIcon, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Bookmark } from "../model";

interface BookmarkItemProps {
    bookmark: Bookmark;
    articleTitle?: string;
    authorPenName?: string;
    isDragging?: boolean;
    onRemove?: (bookmarkId: string) => void;
    onMove?: (bookmarkId: string) => void;
}

export const BookmarkItem = ({
    bookmark,
    articleTitle = "제목 없음",
    authorPenName,
    isDragging = false,
    onRemove,
    onMove,
}: BookmarkItemProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // authorPenName이 없으면 클릭하지 않음
        if (!authorPenName) {
            toast.error('작가 정보를 찾을 수 없습니다');
            return;
        }
        navigate(`/articles/${authorPenName}/${bookmark.articleId}`);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();

        const baseUrl = window.location.origin;
        const articleUrl = `${baseUrl}/articles/${authorPenName}/${bookmark.articleId}`;

        navigator.clipboard.writeText(articleUrl).then(() => {
            toast.success('링크가 복사되었습니다');
        }).catch(() => {
            toast.error('링크 복사에 실패했습니다');
        });
    };
    return (
        <div
            onClick={handleClick}
            className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-all cursor-pointer ${
                isDragging
                    ? 'bg-violet-50 dark:bg-violet-900/20 opacity-50'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            draggable
        >
            {/* 헤더 */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-2 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                    <BookmarkIcon
                        size={16}
                        className="text-violet-600 flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {articleTitle}
                        </h4>
                        {authorPenName && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {authorPenName}
                            </p>
                        )}
                    </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={handleShare}
                        className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="링크 복사"
                    >
                        <Share2 size={16} />
                    </button>

                    {onMove && (
                        <button
                            onClick={() => onMove(bookmark.id)}
                            className="p-1 rounded hover:bg-violet-100 dark:hover:bg-violet-900/30 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            title="다른 컬렉션으로 이동"
                        >
                            →
                        </button>
                    )}

                    {onRemove && (
                        <button
                            onClick={() => onRemove(bookmark.id)}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="북마크 제거"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* 메타 정보 */}
            <div className="text-xs text-gray-500 dark:text-gray-500 ml-5">
                저장됨 {formatDistanceToNow(bookmark.createdAt, { addSuffix: true, locale: ko })}
            </div>
        </div>
    );
};
