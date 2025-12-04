import { useInfiniteComments } from "../lib";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
    articleId: string;
    isSignedIn?: boolean;
    onCommentLike?: (commentId: string) => void;
    onCommentDelete?: (commentId: string) => void;
    onReply?: (parentId: string) => void;
    replyingTo?: string | null;
    onShowReplyForm?: (parentId: string | null) => void;
    renderReplyForm?: (parentCommentId: string) => React.ReactNode;
}

export const CommentList = ({
    articleId,
    isSignedIn = false,
    onCommentLike,
    onCommentDelete,
    onReply,
    replyingTo,
    onShowReplyForm,
    renderReplyForm,
}: CommentListProps) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteComments(articleId, 10, 'LATEST');

    if (isLoading) {
        return <div className="text-center text-gray-500 py-8">댓글 로딩 중...</div>;
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                댓글을 불러올 수 없습니다
            </div>
        );
    }

    const allComments = data?.pages.flatMap(page => page) ?? [];

    if (allComments.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                댓글이 없습니다
            </div>
        );
    }

    // 남은 댓글 수 계산
    const remainingCount = data?.pages[data.pages.length - 1]?.length ?? 0;
    const shouldShowLoadMore = hasNextPage;
    const buttonText = remainingCount <= 3 && shouldShowLoadMore
        ? `전체 불러오기 (${remainingCount})`
        : '더 불러오기';

    return (
        <div className="space-y-4">
            {/* 댓글 목록 */}
            <div className="space-y-4">
                {allComments.map((comment) => (
                    <div key={comment.id}>
                        <CommentItem
                            comment={comment}
                            depth={0}
                            isSignedIn={isSignedIn}
                            onLike={onCommentLike}
                            onDelete={onCommentDelete}
                            onReply={onReply}
                            replyingTo={replyingTo}
                            onShowReplyForm={onShowReplyForm}
                        />
                        {replyingTo === comment.id && renderReplyForm && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ml-0">
                                {renderReplyForm(comment.id)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 더 불러오기 버튼 */}
            {shouldShowLoadMore && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        {isFetchingNextPage ? '로딩 중...' : buttonText}
                    </button>
                </div>
            )}
        </div>
    );
};
