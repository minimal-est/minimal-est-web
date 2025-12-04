import { useState } from 'react';
import { addBookmark } from '@/entities/bookmark';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkKeys } from '@/entities/bookmark/lib/queryKeys';
import { toast } from 'sonner';

interface UseBookmarkAddingProps {
    collectionId?: string;
}

export const useBookmarkAdding = ({ collectionId = '' }: UseBookmarkAddingProps = {}) => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    // 직접 mutation을 만들어 항상 올바른 collectionId를 사용하도록 함
    const addBookmarkMutation = useMutation({
        mutationFn: ({ articleId, collectionId: actualCollectionId }: { articleId: string; collectionId: string }) =>
            addBookmark(articleId, actualCollectionId),
        onSuccess: (_, { collectionId: actualCollectionId }) => {
            toast.success('북마크가 추가되었습니다');
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.bookmarksList(actualCollectionId),
            });
            // 컬렉션 캐시 초기화 (개수 업데이트)
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.collectionsList(),
            });
        },
        onError: (error: any) => {
            const errorMessage = error?.detail || error?.message || '북마크 추가에 실패했습니다';
            toast.error(errorMessage);
        },
    });

    const handleAddBookmark = async (articleId: string, passedCollectionId?: string) => {
        const finalCollectionId = passedCollectionId || collectionId;

        if (!finalCollectionId) {
            toast.error('컬렉션을 선택해주세요');
            return;
        }

        try {
            await addBookmarkMutation.mutateAsync({
                articleId,
                collectionId: finalCollectionId,
            });
            // 성공했을 때만 모달 닫기
            setIsOpen(false);
        } catch (error) {
            // onError에서 이미 처리됨
            // 오류 발생 시 모달을 열린 상태로 유지
        }
    };

    return {
        isOpen,
        setIsOpen,
        addBookmark: handleAddBookmark,
        isLoading: addBookmarkMutation.isPending,
        error: addBookmarkMutation.error,
    };
};
