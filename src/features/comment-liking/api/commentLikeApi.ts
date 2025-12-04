import { client } from "@/shared/api/client";

/**
 * 댓글 좋아요 (회원만 가능)
 * @param articleId - 아티클 ID
 * @param commentId - 댓글 ID
 */
export const likeComment = async (
    articleId: string,
    commentId: string
): Promise<void> => {
    await client.post(`/articles/${articleId}/comments/${commentId}/like`);
};

/**
 * 댓글 좋아요 취소 (회원만 가능)
 * @param articleId - 아티클 ID
 * @param commentId - 댓글 ID
 */
export const unlikeComment = async (
    articleId: string,
    commentId: string
): Promise<void> => {
    await client.delete(`/articles/${articleId}/comments/${commentId}/like`);
};
