import { useState } from 'react';
import { useCreateMemberComment } from '@/entities/comment/lib';
import { GuestCommentForm } from './GuestCommentForm';
import type { MemberCommentRequest } from '@/entities/comment/model';
import { toast } from 'sonner';

interface MemberCommentFormProps {
    articleId: string;
    parentCommentId?: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const MemberCommentForm = ({
    articleId,
    parentCommentId,
    onSuccess,
    onCancel,
}: MemberCommentFormProps) => {
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const { mutate, isPending } = useCreateMemberComment(articleId);

    // 익명 체크 시 GuestCommentForm으로 전환
    if (isAnonymous) {
        return (
            <GuestCommentForm
                articleId={articleId}
                parentCommentId={parentCommentId}
                onSuccess={onSuccess}
                onCancel={() => {
                    setIsAnonymous(false);
                    onCancel?.();
                }}
            />
        );
    }

    // 유효성 검사
    const isValid =
        content.trim().length >= 1 && content.trim().length <= 5000;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValid) {
            toast.error('댓글을 1자 이상 5000자 이하로 작성해주세요');
            return;
        }

        const request: MemberCommentRequest = {
            content: content.trim(),
            isAnonymous,
            parentCommentId: parentCommentId || null,
        };

        mutate(request, {
            onSuccess: () => {
                setContent('');
                setIsAnonymous(false);
                toast.success('댓글이 작성되었습니다');
                onSuccess?.();
            },
            onError: (error) => {
                console.error('댓글 작성 실패:', error);
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error('댓글 작성에 실패했습니다');
                }
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {/* 댓글 내용 */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={parentCommentId ? "답글을 입력하세요 (1-5000자)" : "댓글을 입력하세요 (1-5000자)"}
                maxLength={5000}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
            />

            {/* 익명 여부 + 액션 버튼 */}
            <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-1 focus:ring-violet-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">익명</span>
                </label>

                <div className="flex gap-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isPending}
                            className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            취소
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!isValid || isPending}
                        className="px-3 py-1.5 text-sm rounded bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isPending ? '작성 중...' : '작성'}
                    </button>
                </div>
            </div>
        </form>
    );
};
