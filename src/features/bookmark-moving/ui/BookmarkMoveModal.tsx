import { X } from 'lucide-react';
import { useCollections } from '@/entities/bookmark';

interface BookmarkMoveModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    onClose: () => void;
    onMove: (collectionId: string) => Promise<void>;
}

export const BookmarkMoveModal = ({
    isOpen,
    isLoading = false,
    onClose,
    onMove,
}: BookmarkMoveModalProps) => {
    const { data: collections = [], isLoading: isLoadingCollections } = useCollections();

    const handleMove = async (collectionId: string) => {
        await onMove(collectionId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-950 max-w-sm w-full mx-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        북마크 이동
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 컬렉션 목록 */}
                <div className="max-h-80 overflow-y-auto">
                    {isLoadingCollections ? (
                        <div className="px-6 py-8 text-center text-sm text-gray-500">
                            로딩 중...
                        </div>
                    ) : collections.length === 0 ? (
                        <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            컬렉션이 없습니다
                        </div>
                    ) : (
                        <div className="px-2 py-2">
                            {collections.map((collection) => (
                                <button
                                    key={collection.id}
                                    onClick={() => handleMove(collection.id)}
                                    disabled={isLoading}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 border-b border-gray-200 dark:border-gray-800 last:border-0"
                                >
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {collection.title}
                                    </div>
                                    {collection.description && (
                                        <div className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">
                                            {collection.description}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 푸터 */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};
