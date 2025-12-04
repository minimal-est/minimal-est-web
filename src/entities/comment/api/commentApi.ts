import { client } from "@/shared/api/client";
import type {
    Comment,
    CommentResponse,
    CommentListResponse,
    GuestCommentRequest,
    MemberCommentRequest,
    CommentQueryParams,
} from "../model";

/**
 * 댓글 목록 조회 (회원/비회원 모두 조회 가능)
 * @param articleId - 아티클 ID
 * @param params - 조회 파라미터 (page, limit, sort)
 * @returns 댓글 목록
 */
export const fetchComments = async (
    articleId: string,
    params?: CommentQueryParams
): Promise<Comment[]> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    const response = await client.get<CommentListResponse>(
        `/articles/${articleId}/comments?${queryParams.toString()}`
    );

    return response.data.comments.map(convertCommentResponseToComment);
};

/**
 * 회원 댓글 작성
 * @param articleId - 아티클 ID
 * @param request - 댓글 작성 정보
 * @returns 생성된 댓글
 */
export const createMemberComment = async (
    articleId: string,
    request: MemberCommentRequest
): Promise<Comment> => {
    const response = await client.post<CommentResponse>(
        `/articles/${articleId}/comments`,
        request
    );

    return convertCommentResponseToComment(response.data);
};

/**
 * 비회원(게스트) 댓글 작성
 * @param articleId - 아티클 ID
 * @param request - 비회원 댓글 작성 정보
 * @returns 생성된 댓글
 */
export const createGuestComment = async (
    articleId: string,
    request: GuestCommentRequest
): Promise<Comment> => {
    const response = await client.post<CommentResponse>(
        `/articles/${articleId}/comments/guest`,
        request
    );

    return convertCommentResponseToComment(response.data);
};

/**
 * 회원 댓글 삭제
 * @param articleId - 아티클 ID
 * @param commentId - 댓글 ID
 */
export const deleteMemberComment = async (
    articleId: string,
    commentId: string
): Promise<void> => {
    await client.delete(`/articles/${articleId}/comments/${commentId}`);
};

/**
 * 비회원(게스트) 댓글 삭제
 * @param articleId - 아티클 ID
 * @param commentId - 댓글 ID
 * @param password - 댓글 삭제 비밀번호
 */
export const deleteGuestComment = async (
    articleId: string,
    commentId: string,
    password: string
): Promise<void> => {
    await client.delete(
        `/articles/${articleId}/comments/${commentId}/guest?password=${encodeURIComponent(password)}`
    );
};

/**
 * CommentResponse를 Comment로 변환
 * - 문자열 createdAt을 Date 객체로 변환
 * - authorInfo 필드 매핑 (회원이고 비익명일 때만)
 */
const convertCommentResponseToComment = (response: CommentResponse): Comment => {
    return {
        id: response.id,
        articleId: '',  // 응답에 없어서 빈값 (필요시 별도 처리)
        authorName: response.authorName,
        content: response.content,
        likeCount: response.likeCount,
        createdAt: new Date(response.createdAt),
        isGuest: response.isGuest,
        authorInfo: response.authorInfo ?? null,
        replies: response.replies.map(convertCommentResponseToComment),
    };
};
