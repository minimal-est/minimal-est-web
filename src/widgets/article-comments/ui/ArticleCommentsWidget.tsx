import { useAuth } from '@/entities/user/lib';
import { CommentList } from '@/entities/comment/ui';
import { GuestCommentForm, MemberCommentForm, useCommentForm } from '@/features/comment-creating';

interface ArticleCommentsWidgetProps {
    articleId: string;
}

export const ArticleCommentsWidget = ({ articleId }: ArticleCommentsWidgetProps) => {
    const { isSignedIn } = useAuth();
    const { parentCommentId, open, reset } = useCommentForm();

    // 댓글 좋아요 (나중에 feature로 분리 예정)
    const handleCommentLike = (commentId: string) => {
        // TODO: useCommentLike hook 추가
        console.log('댓글 좋아요:', commentId);
    };

    // 폼 제출 후
    const handleFormSuccess = () => {
        reset();
    };

    // 답글 폼 렌더링
    const renderReplyForm = (commentId: string) => (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-4">
            {isSignedIn ? (
                <MemberCommentForm
                    articleId={articleId}
                    parentCommentId={commentId}
                    onSuccess={handleFormSuccess}
                    onCancel={() => reset()}
                />
            ) : (
                <GuestCommentForm
                    articleId={articleId}
                    parentCommentId={commentId}
                    onSuccess={handleFormSuccess}
                    onCancel={() => reset()}
                />
            )}
        </div>
    );

    return (
        <div className="space-y-4">
            {/* 섹션 헤더 */}
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
                댓글
            </h2>

            {/* 댓글 작성 폼 - 로그인 상태에 따라 다른 폼 표시 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-4">
                {isSignedIn ? (
                    <MemberCommentForm
                        articleId={articleId}
                        parentCommentId={parentCommentId}
                        onSuccess={handleFormSuccess}
                    />
                ) : (
                    <GuestCommentForm
                        articleId={articleId}
                        parentCommentId={parentCommentId}
                        onSuccess={handleFormSuccess}
                    />
                )}
            </div>

            {/* 댓글 목록 */}
            <CommentList
                articleId={articleId}
                isSignedIn={isSignedIn}
                onCommentLike={handleCommentLike}
                onCommentDelete={() => {
                    // TODO: 댓글 삭제 로직 구현
                    // CommentItem에서 comment 객체 정보를 받아서 처리
                }}
                replyingTo={parentCommentId}
                onShowReplyForm={open}
                renderReplyForm={renderReplyForm}
            />
        </div>
    );
};
