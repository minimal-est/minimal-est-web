/**
 * 댓글 관련 타입 정의
 * 회원 댓글과 비회원(게스트) 댓글 모두 포함
 */

// ============ 기본 타입 ============

/**
 * 댓글 작성자 정보 (회원만)
 */
export interface CommentAuthor {
    penName: string;
    profileImageUrl: string;
    blogUrl: string;
}

/**
 * 댓글 (회원/비회원 통합)
 * - 좋아요 정보 포함
 * - 대댓글 정보 포함
 */
export interface Comment {
    id: string;
    articleId: string;
    authorName: string;          // 회원: 펜네임 또는 "(익명)", 비회원: 입력한 이름
    content: string;             // 삭제된 댓글은 "삭제된 댓글입니다"
    likeCount: number;           // 좋아요 개수
    createdAt: Date;             // ISO 8601 형식의 문자열
    isGuest: boolean;            // true: 비회원, false: 회원
    authorInfo?: CommentAuthor | null;  // 회원일 때만 존재
    replies: Comment[];          // 대댓글 목록
}

/**
 * 댓글 조회 응답
 * API에서 받는 형태
 */
export interface CommentResponse {
    id: string;
    authorName: string;
    content: string;
    isGuest: boolean;            // true: 비회원, false: 회원
    authorInfo?: CommentAuthor | null;  // 회원일 때만 존재
    likeCount: number;
    createdAt: string;           // ISO 8601 문자열
    replies: CommentResponse[];
}

// ============ 비회원(게스트) 댓글 ============

/**
 * 비회원 댓글 작성 요청
 */
export interface GuestCommentRequest {
    authorName: string;    // 2-50자
    content: string;       // 1-5000자
    password: string;      // 4-20자 (삭제 시 필요)
    parentCommentId?: string | null;
    recaptchaToken?: string | null;
}

/**
 * 비회원 댓글 삭제 요청
 * (쿼리 파라미터로 전달)
 */
export interface GuestCommentDeleteRequest {
    password: string;
}

// ============ 회원 댓글 ============

/**
 * 회원 댓글 작성 요청
 */
export interface MemberCommentRequest {
    content: string;           // 1-5000자
    isAnonymous: boolean;      // 익명 여부
    parentCommentId?: string | null;
}

// ============ 댓글 목록 조회 ============

/**
 * 댓글 정렬 옵션 (회원만 지원)
 * - LATEST: 최신순
 * - POPULAR: 인기순 (좋아요)
 */
export type CommentSortType = 'LATEST' | 'POPULAR';

/**
 * 댓글 조회 쿼리 파라미터
 */
export interface CommentQueryParams {
    page?: number;              // 기본값: 0
    limit?: number;             // 기본값: 10
    sort?: CommentSortType;     // 기본값: LATEST
}

/**
 * 댓글 목록 조회 응답
 */
export interface CommentListResponse {
    comments: CommentResponse[];
    // 추가 페이지네이션 정보가 필요하면 추가
    totalCount?: number;
    hasMore?: boolean;
}

// ============ 좋아요 관련 ============

/**
 * 댓글 좋아요 정보
 */
export interface CommentLike {
    commentId: string;
    userId: string;
    createdAt: Date;
}

/**
 * 내 좋아요 상태 (회원만)
 */
export interface MyCommentLike {
    commentId: string;
    isLiked: boolean;
}

// ============ 에러 응답 ============

/**
 * API 에러 응답
 */
export interface CommentErrorResponse {
    status: number;
    title: string;
    detail: string;
    properties?: {
        errors?: Record<string, string>;
    };
}
