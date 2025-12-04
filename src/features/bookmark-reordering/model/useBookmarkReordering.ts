import { useReorderBookmarks } from '@/entities/bookmark';

interface UseBookmarkReorderingProps {
    collectionId: string;
}

export const useBookmarkReordering = ({ collectionId }: UseBookmarkReorderingProps) => {
    const reorderMutation = useReorderBookmarks(collectionId);

    const handleReorder = async (bookmarkIds: string[]) => {
        await reorderMutation.mutateAsync({
            bookmarkIds,
        });
    };

    return {
        reorderBookmarks: handleReorder,
        isLoading: reorderMutation.isPending,
        error: reorderMutation.error,
    };
};
