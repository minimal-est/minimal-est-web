import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Trash2, MessageCircle } from "lucide-react";
import { ProfileAvatar } from "@/entities/blog/ui";
import type { Comment } from "../model";

interface CommentItemProps {
    comment: Comment;
    depth?: number;
    onReply?: (parentId: string) => void;
    onLike?: (commentId: string) => void;
    onDelete?: (commentId: string) => void;
    isMyComment?: boolean;
    isSignedIn?: boolean;
    isLiked?: boolean;
    replyingTo?: string | null;
    onShowReplyForm?: (parentId: string | null) => void;
}

export const CommentItem = ({
    comment,
    depth = 0,
    onReply,
    onLike,
    onDelete,
    isMyComment = false,
    isSignedIn = false,
    isLiked = false,
    replyingTo,
    onShowReplyForm,
}: CommentItemProps) => {
    const isDeleted = comment.content === "삭제된 댓글입니다";
    const isReply = depth > 0;
    const canReply = !isDeleted && depth === 0;
    const canDelete = isMyComment && !isDeleted;
    const isAnonymous = comment.isGuest || !comment.authorInfo;

    return (
        <div
            className={`py-3 ${
                isReply
                    ? 'pl-4 ml-4 border-l border-gray-200 dark:border-gray-800'
                    : 'border-b border-gray-200 dark:border-gray-800'
            }`}
        >
            {/* 헤더 */}
            <div className="flex items-center gap-2 mb-1.5">
                {!isAnonymous && comment.authorInfo && (
                    <ProfileAvatar
                        penName={comment.authorInfo.penName}
                        profileImageUrl={comment.authorInfo.profileImageUrl}
                        size="xs"
                    />
                )}
                <div className="flex items-baseline gap-1.5">
                    <span className={`text-xs font-semibold leading-none ${
                        isDeleted ? 'text-gray-400' : 'text-gray-900 dark:text-white'
                    }`}>
                        {comment.authorName}
                    </span>
                    {isAnonymous && (
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                            익명
                        </span>
                    )}
                    <span className="text-xs text-gray-400 dark:text-gray-600">
                        {formatDistanceToNow(comment.createdAt, {
                            addSuffix: true,
                            locale: ko,
                        })}
                    </span>
                </div>
            </div>

            {/* 내용 */}
            <p className={`text-sm leading-relaxed mb-2 ${
                isDeleted
                    ? 'text-gray-400 italic'
                    : 'text-gray-700 dark:text-gray-300'
            }`}>
                {comment.content}
            </p>

            {/* 액션 버튼 */}
            {!isDeleted && (
                <div className="flex items-center gap-3 text-xs">
                    {canReply && (
                        <button
                            onClick={() => onShowReplyForm?.(comment.id)}
                            className="flex items-center gap-1 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors font-medium"
                        >
                            <MessageCircle size={12} />
                            <span>답글</span>
                        </button>
                    )}

                    {canDelete && (
                        <button
                            onClick={() => onDelete?.(comment.id)}
                            className="flex items-center gap-1 text-gray-500 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                        >
                            <Trash2 size={12} />
                            <span>삭제</span>
                        </button>
                    )}
                </div>
            )}

            {/* 대댓글 */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 space-y-0">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            onReply={onReply}
                            onLike={onLike}
                            onDelete={onDelete}
                            isMyComment={isMyComment}
                            isSignedIn={isSignedIn}
                            isLiked={isLiked}
                            replyingTo={replyingTo}
                            onShowReplyForm={onShowReplyForm}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
