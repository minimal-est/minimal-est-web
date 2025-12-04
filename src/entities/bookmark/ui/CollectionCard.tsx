import { Folder, Lock, Globe } from "lucide-react";
import { useToggleCollectionPublic } from "../lib";
import type { Collection } from "../model";

interface CollectionCardProps {
    collection: Collection;
    bookmarkCount?: number;
    isSelected?: boolean;
    onSelect?: (collectionId: string) => void;
    onEdit?: (collection: Collection) => void;
    onDelete?: (collectionId: string) => void;
    onTogglePublic?: (collectionId: string, isPublic: boolean) => void;
}

export const CollectionCard = ({
    collection,
    isSelected = false,
    onSelect,
    onEdit,
    onDelete,
    onTogglePublic,
}: CollectionCardProps) => {
    const { mutate: togglePublic, isPending: isTogglingPublic } = useToggleCollectionPublic(collection.id);
    return (
        <div
            onClick={() => onSelect?.(collection.id)}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                    ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-300 dark:hover:border-violet-600'
            }`}
        >
            {/* 헤더 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Folder
                        size={20}
                        className={
                            isSelected
                                ? 'text-violet-600'
                                : 'text-gray-500 dark:text-gray-400'
                        }
                    />
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {collection.title}
                    </h3>
                </div>

                {/* 공개/비공개 토글 */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePublic(undefined, {
                            onSuccess: () => {
                                onTogglePublic?.(collection.id, !collection.isPublic);
                            },
                        });
                    }}
                    disabled={isTogglingPublic}
                    className="flex-shrink-0 p-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    title={collection.isPublic ? "비공개로 변경" : "공개로 변경"}
                >
                    {collection.isPublic ? (
                        <Globe
                            size={16}
                            className="text-blue-500"
                        />
                    ) : (
                        <Lock
                            size={16}
                            className="text-gray-500 dark:text-gray-400"
                        />
                    )}
                </button>
            </div>

            {/* 설명 */}
            {collection.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {collection.description}
                </p>
            )}

            {/* 푸터 */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-500">
                    {collection.bookmarkCount}개의 북마크
                </span>

                {!collection.isDefault && (
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(collection);
                            }}
                            className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        >
                            수정
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(collection.id);
                            }}
                            className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
