// ============ 기본 타입 ============

/**
 * 컬렉션 (북마크를 모으는 폴더)
 */
export interface Collection {
    id: string;
    title: string;
    description: string | null;
    isPublic: boolean;
    isDefault: boolean;
    bookmarkCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 컬렉션 조회 응답 (API)
 */
export interface CollectionResponse {
    id: string;
    title: string;
    description: string | null;
    isPublic: boolean;
    isDefault: boolean;
    bookmarkCount?: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * 북마크 (저장된 글)
 */
export interface Bookmark {
    id: string;
    collectionId: string;
    articleId: string;
    articleSlug?: string;
    articleTitle?: string;
    authorPenName?: string;
    sequence: number;
    createdAt: Date;
}

/**
 * 북마크 조회 응답 (API)
 */
export interface BookmarkResponse {
    id: string;
    collectionId: string;
    articleId: string;
    articleSlug?: string;
    articleTitle?: string;
    authorPenName?: string;
    sequence: number;
    createdAt: string;
}

/**
 * 북마크 with 글 정보 (상세 표시용)
 */
export interface BookmarkWithArticle extends Bookmark {
    article?: {
        id: string;
        title: string;
        description: string;
        content: string;
        author: {
            penName: string;
            profileImageUrl?: string;
        };
    };
}

// ============ 요청 타입 ============

/**
 * 컬렉션 생성 요청
 */
export interface CreateCollectionRequest {
    title: string;
    description?: string;
    isPublic?: boolean;
}

/**
 * 컬렉션 수정 요청
 */
export interface UpdateCollectionRequest {
    title: string;
    description?: string;
    isPublic?: boolean;
}

/**
 * 북마크 순서 변경 요청
 */
export interface ReorderBookmarksRequest {
    bookmarkIds: string[];
}

// ============ 쿼리 파라미터 ============

/**
 * 컬렉션 목록 조회 파라미터
 */
export interface CollectionQueryParams {
    page?: number;
    limit?: number;
}

/**
 * 북마크 목록 조회 파라미터
 */
export interface BookmarkQueryParams {
    page?: number;
    limit?: number;
}
