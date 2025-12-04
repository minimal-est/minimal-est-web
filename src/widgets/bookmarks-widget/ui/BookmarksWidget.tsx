import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useBookmarks, useCollections } from '@/entities/bookmark';
import {
    CollectionCard,
    BookmarkList,
} from '@/entities/bookmark';
import {
    useBookmarkAdding,
    BookmarkAddButton,
    BookmarkAddModal,
} from '@/features/bookmark-adding';
import {
    useCollectionManaging,
    CollectionModal,
    CollectionDeleteModal,
} from '@/features/collection-managing';
import { useBookmarkRemoving } from '@/features/bookmark-removing';
import { useBookmarkMoving, BookmarkMoveModal } from '@/features/bookmark-moving';
import { useBookmarkReordering } from '@/features/bookmark-reordering';

export const BookmarksWidget = () => {
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
    const [bookmarkCountMap, setBookmarkCountMap] = useState<Record<string, number>>({});

    // Collections 조회
    const { data: collections = [], isLoading: isLoadingCollections } = useCollections();

    // Bookmarks 조회
    const { data: bookmarks = [], isLoading: isLoadingBookmarks } = useBookmarks(
        selectedCollectionId || ''
    );

    // 북마크 개수 업데이트 (선택된 컬렉션이 변경되거나 북마크가 로드될 때)
    useEffect(() => {
        if (selectedCollectionId) {
            setBookmarkCountMap((prev) => ({
                ...prev,
                [selectedCollectionId]: bookmarks.length,
            }));
        }
    }, [bookmarks, selectedCollectionId]);

    // 컬렉션이 로드될 때 모든 컬렉션의 개수를 0으로 초기화
    useEffect(() => {
        if (collections.length > 0) {
            const initialMap: Record<string, number> = {};
            collections.forEach((collection) => {
                initialMap[collection.id] = bookmarkCountMap[collection.id] ?? 0;
            });
            setBookmarkCountMap(initialMap);
        }
    }, [collections]);

    // 북마크 추가
    const bookmarkAdding = useBookmarkAdding({
        collectionId: selectedCollectionId || '',
    });

    // 컬렉션 관리
    const collectionManaging = useCollectionManaging();

    // 북마크 제거
    const bookmarkRemoving = useBookmarkRemoving({
        collectionId: selectedCollectionId || '',
    });

    // 북마크 이동
    const bookmarkMoving = useBookmarkMoving();

    // 북마크 순서 변경
    const bookmarkReordering = useBookmarkReordering({
        collectionId: selectedCollectionId || '',
    });

    // 초기 선택 처리
    useEffect(() => {
        if (selectedCollectionId === null && collections.length > 0) {
            const defaultCollection = collections.find((c) => c.isDefault);
            if (defaultCollection) {
                setSelectedCollectionId(defaultCollection.id);
            }
        }
    }, [collections, selectedCollectionId]);

    const currentCollection = collections.find((c) => c.id === selectedCollectionId);

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* 헤더 */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        내 북마크
                    </h1>
                    <button
                        onClick={collectionManaging.openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors font-medium"
                    >
                        <Plus size={20} />
                        새 컬렉션
                    </button>
                </div>
            </div>

            {/* 컬렉션 목록 */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    컬렉션
                </h2>
                {isLoadingCollections ? (
                    <div className="text-center py-8 text-gray-500">로딩 중...</div>
                ) : collections.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        컬렉션이 없습니다
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {collections.map((collection) => {
                            // 선택된 컬렉션이면 현재 조회한 북마크 개수, 아니면 캐시된 개수 또는 0
                            const bookmarkCount =
                                selectedCollectionId === collection.id
                                    ? bookmarks.length
                                    : (bookmarkCountMap[collection.id] ?? 0);

                            return (
                                <CollectionCard
                                    key={collection.id}
                                    collection={collection}
                                    bookmarkCount={bookmarkCount}
                                    isSelected={selectedCollectionId === collection.id}
                                    onSelect={setSelectedCollectionId}
                                    onEdit={collectionManaging.openEditModal}
                                    onDelete={() => collectionManaging.openDeleteModal(collection)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 북마크 섹션 */}
            {selectedCollectionId && currentCollection && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {currentCollection.title}
                            </h2>
                            {currentCollection.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {currentCollection.description}
                                </p>
                            )}
                        </div>
                        <BookmarkAddButton
                            isLoading={bookmarkAdding.isLoading}
                            onClick={() => bookmarkAdding.setIsOpen(true)}
                        />
                    </div>

                    {/* 북마크 리스트 */}
                    <BookmarkList
                        bookmarks={bookmarks}
                        isLoading={isLoadingBookmarks}
                        onRemove={bookmarkRemoving.removeBookmark}
                        onMove={bookmarkMoving.openModal}
                        onReorder={bookmarkReordering.reorderBookmarks}
                    />
                </div>
            )}

            {/* 모달들 */}
            <BookmarkAddModal
                isOpen={bookmarkAdding.isOpen}
                isLoading={bookmarkAdding.isLoading}
                articleId={undefined}
                onClose={() => bookmarkAdding.setIsOpen(false)}
                onAdd={async (articleId, collectionId) => {
                    await bookmarkAdding.addBookmark(articleId, collectionId);
                }}
            />

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
