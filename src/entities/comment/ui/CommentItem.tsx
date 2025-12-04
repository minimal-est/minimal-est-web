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
            className={`border-l-2 pl-4 py-4 ${
                isReply
                    ? 'border-l-gray-300 dark:border-l-gray-600 ml-4'
                    : 'border-l-violet-600 dark:border-l-violet-500'
            }`}
        >
            {/* 헤더 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {/* 프로필 사진 - 비익명 회원일 때만 표시 */}
                    {!isAnonymous && comment.authorInfo && (
                        <ProfileAvatar
                            penName={comment.authorInfo.penName}
                            profileImageUrl={comment.authorInfo.profileImageUrl}
                            size="sm"
                        />
                    )}

                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold text-xs ${
                                isDeleted ? 'text-gray-400' : 'text-gray-900 dark:text-white'
                            }`}>
                                {comment.authorName}
                            </span>
                            {isAnonymous && (
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-semibold">
                                    익명
                                </span>
                            )}
                            {isReply && (
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                    대댓글
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(comment.createdAt, {
                                addSuffix: true,
                                locale: ko,
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* 내용 */}
            <p className={`text-sm leading-relaxed mb-3 ${
                isDeleted
                    ? 'text-gray-400 italic'
                    : 'text-gray-700 dark:text-gray-300'
            }`}>
                {comment.content}
            </p>

            {/* 액션 버튼 */}
            {!isDeleted && (
                <div className="flex items-center gap-4">
                    {/* TODO: 좋아요 버튼 구현 예정
                    <button
                        onClick={handleLikeClick}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                            isLiked
                                ? 'text-red-500'
                                : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                        }`}
                    >
                        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                        <span>{comment.likeCount}</span>
                    </button>
                    */}

                    {canReply && (
                        <button
                            onClick={() => onShowReplyForm?.(comment.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        >
                            <MessageCircle size={14} />
                            <span>답글</span>
                        </button>
                    )}

                    {canDelete && (
                        <button
                            onClick={() => onDelete?.(comment.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                            <Trash2 size={14} />
                            <span>삭제</span>
                        </button>
                    )}
                </div>
            )}

            {/* 대댓글 */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
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
