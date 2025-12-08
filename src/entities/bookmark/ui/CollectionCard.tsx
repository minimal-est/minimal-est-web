import { Lock, Globe } from "lucide-react";
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
            className={`py-3 px-0 border-b transition-opacity cursor-pointer ${
                isSelected
                    ? 'border-gray-300 dark:border-gray-600 opacity-100'
                    : 'border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100'
            }`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-gray-900 dark:text-white truncate">
                        {collection.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                        {collection.bookmarkCount}개
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
                        className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors disabled:opacity-50"
                        title={collection.isPublic ? "비공개" : "공개"}
                    >
                        {collection.isPublic ? (
                            <Globe size={14} />
                        ) : (
                            <Lock size={14} />
                        )}
                    </button>

                    {!collection.isDefault && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(collection);
                                }}
                                className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                            >
                                수정
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(collection.id);
                                }}
                                className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                            >
                                삭제
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
