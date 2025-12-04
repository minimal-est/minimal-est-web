import { useRemoveBookmark } from '@/entities/bookmark';

interface UseBookmarkRemovingProps {
    collectionId: string;
}

export const useBookmarkRemoving = ({ collectionId }: UseBookmarkRemovingProps) => {
    const removeBookmarkMutation = useRemoveBookmark(collectionId);

    const handleRemoveBookmark = async (bookmarkId: string) => {
        await removeBookmarkMutation.mutateAsync(bookmarkId);
    };

    return {
        removeBookmark: handleRemoveBookmark,
        isLoading: removeBookmarkMutation.isPending,
        error: removeBookmarkMutation.error,
    };
};
