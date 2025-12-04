import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCollections } from '@/entities/bookmark';

interface BookmarkAddModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    articleId?: string;
    authorPenName?: string;
    onClose: () => void;
    onAdd: (articleId: string, collectionId: string) => Promise<void>;
}

export const BookmarkAddModal = ({
    isOpen,
    isLoading = false,
    articleId: initialArticleId,
    onClose,
    onAdd,
}: BookmarkAddModalProps) => {
    const [manualArticleId, setManualArticleId] = useState('');
    const [collectionId, setCollectionId] = useState('');
    const { data: collections = [], isLoading: isLoadingCollections } = useCollections();

    // 모달이 닫힐 때만 상태 초기화
    useEffect(() => {
        if (!isOpen) {
            setManualArticleId('');
            setCollectionId('');
        }
    }, [isOpen]);

    // 최종 글 ID 결정 (prop으로 받은 것이 우선, 없으면 수동 입력)
    const finalArticleId = initialArticleId || manualArticleId;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!finalArticleId || !collectionId) return;

        try {
            await onAdd(finalArticleId, collectionId);
            // 성공 후에만 상태 초기화하고 모달 닫기
            setManualArticleId('');
            setCollectionId('');
            onClose();
        } catch (error) {
            // 오류 발생 시 모달을 열린 상태로 유지, 글ID와 컬렉션ID 유지
        }
    };

    const handleClose = () => {
        setManualArticleId('');
        setCollectionId('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        북마크 추가
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* 폼 */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* 글 ID 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            글 ID
                        </label>
                        <input
                            type="text"
                            value={finalArticleId}
                            onChange={(e) => setManualArticleId(e.target.value)}
                            disabled={isLoading || !!initialArticleId}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
                            placeholder="북마크할 글의 ID를 입력하세요"
                        />
                    </div>

                    {/* 컬렉션 선택 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            컬렉션
                        </label>
                        <select
                            value={collectionId}
                            onChange={(e) => setCollectionId(e.target.value)}
                            disabled={isLoading || isLoadingCollections}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
                        >
                            <option value="">컬렉션을 선택하세요</option>
                            {collections.map((collection) => (
                                <option key={collection.id} value={collection.id}>
                                    {collection.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-2 justify-end pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !finalArticleId || !collectionId}
                            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:bg-gray-400 disabled:opacity-50 font-medium"
                        >
                            {isLoading ? '추가 중...' : '추가'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
