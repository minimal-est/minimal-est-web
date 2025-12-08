import { BookmarkItem } from "./BookmarkItem";
import type { Bookmark } from "../model";

interface BookmarkListProps {
    bookmarks: Bookmark[];
    isLoading?: boolean;
    isDraggingId?: string | null;
    onRemove?: (bookmarkId: string) => void;
    onMove?: (bookmarkId: string) => void;
    onReorder?: (bookmarkIds: string[]) => void;
}

export const BookmarkList = ({
    bookmarks,
    isLoading = false,
    isDraggingId,
    onRemove,
    onReorder,
}: BookmarkListProps) => {
    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                    저장된 북마크가 없습니다
                </p>
            </div>
        );
    }

    // 드래그 정렬 핸들러
    const handleDragStart = (e: React.DragEvent, bookmarkId: string) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', bookmarkId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetBookmarkId: string) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');

        if (draggedId === targetBookmarkId) return;

        // 새로운 순서로 정렬
        const fromIndex = bookmarks.findIndex((b) => b.id === draggedId);
        const toIndex = bookmarks.findIndex((b) => b.id === targetBookmarkId);

        if (fromIndex === -1 || toIndex === -1) return;

        const newBookmarks = [...bookmarks];
        const [removed] = newBookmarks.splice(fromIndex, 1);
        newBookmarks.splice(toIndex, 0, removed);

        const newOrder = newBookmarks.map((b) => b.id);
        onReorder?.(newOrder);
    };

    return (
        <div className="space-y-2">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, bookmark.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, bookmark.id)}
                    className="cursor-grab active:cursor-grabbing"
                >
                    <BookmarkItem
                        bookmark={bookmark}
                        articleTitle={bookmark.articleTitle || '제목 없음'}
                        authorPenName={bookmark.authorPenName}
                        isDragging={isDraggingId === bookmark.id}
                        onRemove={onRemove}
                    />
                </div>
            ))}
        </div>
    );
};
