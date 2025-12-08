import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCollections, useBookmarks } from '@/entities/bookmark';
import { CollectionCard, BookmarkList } from '@/entities/bookmark';
import { useCollectionManaging, CollectionModal, CollectionDeleteModal } from '@/features/collection-managing';
import { useBookmarkRemoving } from '@/features/bookmark-removing';
import { useBookmarkMoving, BookmarkMoveModal } from '@/features/bookmark-moving';
import { useBookmarkReordering } from '@/features/bookmark-reordering';

export const CollectionsPage = () => {
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
    const { data: collections = [], isLoading: isLoadingCollections } = useCollections();
    const { data: bookmarks = [], isLoading: isLoadingBookmarks } = useBookmarks(
        selectedCollectionId || ''
    );

    const collectionManaging = useCollectionManaging();
    const bookmarkRemoving = useBookmarkRemoving({
        collectionId: selectedCollectionId || '',
    });
    const bookmarkMoving = useBookmarkMoving();
    const bookmarkReordering = useBookmarkReordering({
        collectionId: selectedCollectionId || '',
    });

    // 초기 선택 처리
    const defaultCollection = collections.find((c) => c.isDefault);
    if (selectedCollectionId === null && defaultCollection) {
        setSelectedCollectionId(defaultCollection.id);
    }

    const currentCollection = collections.find((c) => c.id === selectedCollectionId);

    return (
        <div className="w-full py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        북마크
                    </h1>
                    <button
                        onClick={collectionManaging.openCreateModal}
                        className="flex items-center gap-2 text-gray-900 dark:text-white hover:opacity-60 transition-opacity font-medium text-sm"
                    >
                        <Plus size={18} />
                        새 컬렉션
                    </button>
                </div>

                {/* 컬렉션 목록 */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        컬렉션
                    </h2>
                    {isLoadingCollections ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : collections.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                컬렉션이 없습니다
                            </p>
                            <button
                                onClick={collectionManaging.openCreateModal}
                                className="text-sm text-gray-900 dark:text-white hover:opacity-60 transition-opacity font-medium"
                            >
                                첫 컬렉션 만들기
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {collections.map((collection) => (
                                <CollectionCard
                                    key={collection.id}
                                    collection={collection}
                                    isSelected={selectedCollectionId === collection.id}
                                    onSelect={setSelectedCollectionId}
                                    onEdit={collectionManaging.openEditModal}
                                    onDelete={() => collectionManaging.openDeleteModal(collection)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 북마크 섹션 */}
                {selectedCollectionId && currentCollection && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {currentCollection.title}
                            </h2>
                            {currentCollection.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {currentCollection.description}
                                </p>
                            )}
                        </div>

                        <BookmarkList
                            bookmarks={bookmarks}
                            isLoading={isLoadingBookmarks}
                            onRemove={bookmarkRemoving.removeBookmark}
                            onMove={bookmarkMoving.openModal}
                            onReorder={bookmarkReordering.reorderBookmarks}
                        />
                    </div>
                )}
            </div>

            {/* 모달들 */}
            <CollectionModal
                isOpen={collectionManaging.isModalOpen}
                isLoading={collectionManaging.isLoading}
                collection={collectionManaging.editingCollection}
                onClose={collectionManaging.closeModal}
                onSubmit={
                    collectionManaging.editingCollection
                        ? collectionManaging.updateCollection
                        : collectionManaging.createCollection
                }
            />

            <BookmarkMoveModal
                isOpen={bookmarkMoving.isModalOpen}
                isLoading={bookmarkMoving.isLoading}
                onClose={bookmarkMoving.closeModal}
                onMove={bookmarkMoving.moveBookmark}
            />

            <CollectionDeleteModal
                isOpen={collectionManaging.isDeleteModalOpen}
                isLoading={collectionManaging.isLoading}
                collection={collectionManaging.deletingCollection}
                onClose={collectionManaging.closeDeleteModal}
                onConfirm={collectionManaging.deleteCollection}
            />
        </div>
    );
};
