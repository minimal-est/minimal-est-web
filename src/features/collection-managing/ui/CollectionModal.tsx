import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Collection, CreateCollectionRequest, UpdateCollectionRequest } from '@/entities/bookmark';

interface CollectionModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    collection?: Collection | null;
    onClose: () => void;
    onSubmit: (data: CreateCollectionRequest | UpdateCollectionRequest) => Promise<void>;
}

export const CollectionModal = ({
    isOpen,
    isLoading = false,
    collection,
    onClose,
    onSubmit,
}: CollectionModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        if (collection) {
            setTitle(collection.title);
            setDescription(collection.description || '');
            setIsPublic(collection.isPublic);
        } else {
            setTitle('');
            setDescription('');
            setIsPublic(false);
        }
    }, [collection, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        await onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            isPublic,
        });

        setTitle('');
        setDescription('');
        setIsPublic(false);
    };

    if (!isOpen) return null;

    const isEditing = !!collection;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-950 max-w-md w-full mx-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        {isEditing ? '컬렉션 수정' : '새 컬렉션'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 폼 */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* 제목 */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-0 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white placeholder-gray-500 dark:placeholder-gray-600 disabled:opacity-50 transition-colors"
                            placeholder="컬렉션 제목을 입력하세요"
                        />
                    </div>

                    {/* 설명 */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            설명
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-0 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white placeholder-gray-500 dark:placeholder-gray-600 disabled:opacity-50 resize-none transition-colors"
                            placeholder="컬렉션에 대한 설명을 입력하세요"
                            rows={2}
                        />
                    </div>

                    {/* 공개 여부 */}
                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            disabled={isLoading}
                            className="w-4 h-4 rounded border-gray-300 text-gray-900 dark:text-white focus:ring-0 disabled:opacity-50 cursor-pointer"
                        />
                        <label
                            htmlFor="isPublic"
                            className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                            공개 컬렉션
                        </label>
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !title.trim()}
                            className="px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isLoading ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
