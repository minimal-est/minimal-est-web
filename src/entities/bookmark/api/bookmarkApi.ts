import { client } from "@/shared/api/client";
import type {
    Bookmark,
    BookmarkResponse,
    BookmarkQueryParams,
    ReorderBookmarksRequest,
} from "../model";

/**
 * 컬렉션의 북마크 목록 조회
 */
export const fetchBookmarks = async (
    collectionId: string,
    params?: BookmarkQueryParams
): Promise<Bookmark[]> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const response = await client.get<{ bookmarkCount: number; bookmarks: BookmarkResponse[] }>(
        `/bookmarks/collections/${collectionId}/bookmarks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );

    return response.data.bookmarks.map(convertBookmarkResponseToBookmark);
};

/**
 * 글 저장 (북마크 추가)
 */
export const addBookmark = async (
    articleId: string,
    collectionId: string
): Promise<Bookmark> => {
    const response = await client.post<BookmarkResponse>(
        `/bookmarks/collections/${collectionId}/articles/${articleId}`
    );

    return convertBookmarkResponseToBookmark(response.data);
};

/**
 * 북마크 제거
 */
export const removeBookmark = async (bookmarkId: string): Promise<void> => {
    await client.delete(`/bookmarks/${bookmarkId}`);
};

/**
 * 북마크 이동 (다른 컬렉션으로)
 */
export const moveBookmark = async (
    bookmarkId: string,
    toCollectionId: string
): Promise<Bookmark> => {
    const response = await client.patch<BookmarkResponse>(
        `/bookmarks/${bookmarkId}/move?toCollectionId=${toCollectionId}`
    );

    return convertBookmarkResponseToBookmark(response.data);
};

/**
 * 북마크 순서 변경 (드래그 정렬)
 */
export const reorderBookmarks = async (
    collectionId: string,
    request: ReorderBookmarksRequest
): Promise<void> => {
    await client.patch(
        `/bookmarks/collections/${collectionId}/reorder`,
        request
    );
};

/**
 * BookmarkResponse를 Bookmark으로 변환
 */
const convertBookmarkResponseToBookmark = (response: BookmarkResponse): Bookmark => {
    return {
        id: response.id,
        collectionId: response.collectionId,
        articleId: response.articleId,
        articleTitle: response.articleTitle,
        authorPenName: response.authorPenName,
        sequence: response.sequence,
        createdAt: new Date(response.createdAt),
    };
};
