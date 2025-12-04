import { useState } from 'react';
import { useMoveBookmark } from '@/entities/bookmark';

interface UseBookmarkMovingProps {
    onSuccess?: () => void;
}

export const useBookmarkMoving = ({ onSuccess }: UseBookmarkMovingProps = {}) => {
    const [selectedBookmarkId, setSelectedBookmarkId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const moveBookmarkMutation = useMoveBookmark();

    const handleOpenModal = (bookmarkId: string) => {
        setSelectedBookmarkId(bookmarkId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedBookmarkId(null);
        setIsModalOpen(false);
    };

    const handleMoveBookmark = async (toCollectionId: string) => {
        if (!selectedBookmarkId) return;

        await moveBookmarkMutation.mutateAsync({
            bookmarkId: selectedBookmarkId,
            toCollectionId,
        });

        handleCloseModal();
        onSuccess?.();
    };

    return {
        selectedBookmarkId,
        isModalOpen,
        isLoading: moveBookmarkMutation.isPending,
        error: moveBookmarkMutation.error,
        openModal: handleOpenModal,
        closeModal: handleCloseModal,
        moveBookmark: handleMoveBookmark,
    };
};
