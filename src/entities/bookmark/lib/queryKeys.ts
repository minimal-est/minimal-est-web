import type { BookmarkQueryParams, CollectionQueryParams } from "../model";

/**
 * React Query 캐시 키 팩토리
 */
export const bookmarkKeys = {
    all: ['bookmarks'] as const,

    // 컬렉션 관련
    collections: () => [...bookmarkKeys.all, 'collections'] as const,

    collectionsList: (params?: CollectionQueryParams) =>
        [...bookmarkKeys.collections(), { params }] as const,

    // 북마크 관련
    bookmarks: () => [...bookmarkKeys.all, 'bookmarks'] as const,

    bookmarksList: (collectionId: string, params?: BookmarkQueryParams) =>
        [...bookmarkKeys.bookmarks(), collectionId, { params }] as const,
};
