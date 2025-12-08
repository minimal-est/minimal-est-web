import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCollections } from '@/entities/bookmark';

interface BookmarkAddModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    slug?: string;
    onClose: () => void;
    onAdd: (slug: string, collectionId: string) => Promise<void>;
}

export const BookmarkAddModal = ({
    isOpen,
    isLoading = false,
    slug: initialSlug,
    onClose,
    onAdd,
}: BookmarkAddModalProps) => {
    const [slug, setSlug] = useState('');
    const [collectionId, setCollectionId] = useState('');
    const { data: collections = [], isLoading: isLoadingCollections } = useCollections();

    // 모달이 닫힐 때만 상태 초기화
    useEffect(() => {
        if (!isOpen) {
            setSlug('');
            setCollectionId('');
        }
    }, [isOpen]);

    // 최종 slug 결정 (prop으로 받은 것이 우선, 없으면 수동 입력)
    const finalSlug = initialSlug || slug;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!finalSlug || !collectionId) return;

        try {
            await onAdd(finalSlug, collectionId);
            // 성공 후에만 상태 초기화하고 모달 닫기
            setSlug('');
            setCollectionId('');
            onClose();
        } catch (error) {
            // 오류 발생 시 모달을 열린 상태로 유지, slug와 컬렉션ID 유지
        }
    };

    const handleClose = () => {
        setSlug('');
        setCollectionId('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-950 max-w-md w-full mx-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        북마크 추가
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 폼 */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Slug 입력 */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            글 Slug
                        </label>
                        <input
                            type="text"
                            value={finalSlug}
                            onChange={(e) => setSlug(e.target.value)}
                            disabled={isLoading || !!initialSlug}
                            className="w-full px-0 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white placeholder-gray-500 dark:placeholder-gray-600 disabled:opacity-50 transition-colors"
                            placeholder="북마크할 글의 Slug를 입력하세요"
                        />
                    </div>

                    {/* 컬렉션 선택 */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            컬렉션
                        </label>
                        <select
                            value={collectionId}
                            onChange={(e) => setCollectionId(e.target.value)}
                            disabled={isLoading || isLoadingCollections}
                            className="w-full px-0 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white disabled:opacity-50 transition-colors"
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
                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !finalSlug || !collectionId}
                            className="px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isLoading ? '추가 중...' : '추가'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
