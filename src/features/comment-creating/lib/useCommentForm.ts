import { useState, useCallback } from 'react';

/**
 * 댓글 작성 폼 상태 관리 hook
 * 댓글 작성자 이름, 내용 등의 폼 상태를 관리합니다
 */
export const useCommentForm = (initialState?: { parentCommentId?: string | null }) => {
    const [parentCommentId, setParentCommentId] = useState<string | null | undefined>(
        initialState?.parentCommentId
    );
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback((commentId?: string | null) => {
        setParentCommentId(commentId);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setParentCommentId(undefined);
        setIsOpen(false);
    }, []);

    const reset = useCallback(() => {
        setParentCommentId(undefined);
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        parentCommentId,
        open,
        close,
        reset,
    };
};
