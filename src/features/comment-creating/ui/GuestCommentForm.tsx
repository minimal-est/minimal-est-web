import { useState } from 'react';
import { useCreateGuestComment } from '@/entities/comment/lib';
import type { GuestCommentRequest } from '@/entities/comment/model';
import { toast } from 'sonner';

interface GuestCommentFormProps {
    articleId: string;
    parentCommentId?: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const GuestCommentForm = ({
    articleId,
    parentCommentId,
    onSuccess,
    onCancel,
}: GuestCommentFormProps) => {
    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');
    const [password, setPassword] = useState('');
    const { mutate, isPending } = useCreateGuestComment(articleId);

    // 유효성 검사
    const isValid =
        authorName.trim().length >= 2 &&
        authorName.trim().length <= 50 &&
        content.trim().length >= 1 &&
        content.trim().length <= 5000 &&
        password.length >= 4 &&
        password.length <= 20;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValid) {
            toast.error('입력 형식을 확인해주세요');
            return;
        }

        const request: GuestCommentRequest = {
            authorName: authorName.trim(),
            content: content.trim(),
            password,
            parentCommentId: parentCommentId || null,
        };

        mutate(request, {
            onSuccess: () => {
                setAuthorName('');
                setContent('');
                setPassword('');
                toast.success('댓글이 작성되었습니다');
                onSuccess?.();
            },
            onError: (error) => {
                console.error('댓글 작성 실패:', error);
                toast.error('댓글 작성에 실패했습니다');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {/* 작성자 정보 (한 줄) */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="이름 (2-50자)"
                    maxLength={50}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 (4-20자)"
                    maxLength={20}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
                />
            </div>

            {/* 댓글 내용 */}
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={parentCommentId ? "답글을 입력하세요 (1-5000자)" : "댓글을 입력하세요 (1-5000자)"}
                    maxLength={5000}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    삭제 시 비밀번호 필수
                </p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2 justify-end">
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
        </form>
    );
};
