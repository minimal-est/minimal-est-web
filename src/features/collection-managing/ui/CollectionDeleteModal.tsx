import { AlertCircle } from 'lucide-react';
import type { Collection } from '@/entities/bookmark';

interface CollectionDeleteModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    collection: Collection | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const CollectionDeleteModal = ({
    isOpen,
    isLoading = false,
    collection,
    onClose,
    onConfirm,
}: CollectionDeleteModalProps) => {
    if (!isOpen || !collection) return null;

    const handleConfirm = async () => {
        await onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-950 max-w-md w-full mx-4">
                {/* 헤더 */}
                <div className="flex items-start gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                            컬렉션 삭제
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            이 작업은 되돌릴 수 없습니다.
                        </p>
                    </div>
                </div>

                {/* 메시지 */}
                <div className="px-6 py-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">"{collection.title}"</span> 컬렉션을 삭제하시겠습니까?
                    </p>
                    {collection.isDefault && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-3">
                            ⚠️ 기본 컬렉션은 삭제할 수 없습니다.
                        </p>
                    )}
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || collection.isDefault}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? '삭제 중...' : '삭제'}
                    </button>
                </div>
            </div>
        </div>
    );
};
