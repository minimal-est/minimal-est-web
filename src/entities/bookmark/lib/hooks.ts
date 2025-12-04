import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchCollections,
    createCollection,
    updateCollection,
    toggleCollectionPublic,
    deleteCollection,
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    moveBookmark,
    reorderBookmarks,
} from "../api";
import { bookmarkKeys } from "./queryKeys";
import type {
    CreateCollectionRequest,
    UpdateCollectionRequest,
    ReorderBookmarksRequest,
    CollectionQueryParams,
    BookmarkQueryParams,
    Bookmark,
} from "../model";

/**
 * 내 컬렉션 목록 조회
 */
export const useCollections = (params?: CollectionQueryParams) => {
    return useQuery({
        queryKey: bookmarkKeys.collectionsList(params),
        queryFn: () => fetchCollections(params),
        staleTime: 1000 * 60 * 5, // 5분
    });
};

/**
 * 컬렉션 생성
 */
export const useCreateCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CreateCollectionRequest) => createCollection(request),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.collectionsList(),
                exact: false,
            });
        },
    });
};

/**
 * 컬렉션 수정
 */
export const useUpdateCollection = (collectionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UpdateCollectionRequest) =>
            updateCollection(collectionId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.collectionsList(),
                exact: false,
            });
        },
    });
};

/**
 * 컬렉션 공개/비공개 토글
 */
export const useToggleCollectionPublic = (collectionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => toggleCollectionPublic(collectionId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.collectionsList(),
                exact: false,
            });
        },
    });
};

/**
 * 컬렉션 삭제
 */
export const useDeleteCollection = (collectionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteCollection(collectionId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.collectionsList(),
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.bookmarksList(collectionId),
                exact: false,
            });
        },
    });
};

/**
 * 컬렉션의 북마크 목록 조회
 */
export const useBookmarks = (
    collectionId: string,
    params?: BookmarkQueryParams
) => {
    return useQuery({
        queryKey: bookmarkKeys.bookmarksList(collectionId, params),
        queryFn: () => fetchBookmarks(collectionId, params),
        staleTime: 1000 * 60 * 5, // 5분
        enabled: !!collectionId, // collectionId가 있을 때만 요청
    });
};

/**
 * 북마크 추가 (낙관적 업데이트)
 */
export const useAddBookmark = (collectionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (articleId: string) => addBookmark(articleId, collectionId),

        // 요청 전: 낙관적으로 캐시 업데이트
        onMutate: async (articleId) => {
            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({
                queryKey: bookmarkKeys.bookmarksList(collectionId),
            });

            // 이전 데이터 백업
            const previousBookmarks = queryClient.getQueryData<Bookmark[]>(
                bookmarkKeys.bookmarksList(collectionId)
            );

            // 낙관적으로 캐시 업데이트
            if (previousBookmarks) {
                const optimisticBookmark: Bookmark = {
                    id: `optimistic-${Date.now()}`,
                    collectionId,
                    articleId,
                    sequence: previousBookmarks.length,
                    createdAt: new Date(),
                };

                queryClient.setQueryData(
                    bookmarkKeys.bookmarksList(collectionId),
                    [...previousBookmarks, optimisticBookmark]
                );
            }

            return { previousBookmarks };
        },

        // 요청 실패: 이전 데이터로 롤백
        onError: (_, __, context) => {
            if (context?.previousBookmarks) {
                queryClient.setQueryData(
                    bookmarkKeys.bookmarksList(collectionId),
                    context.previousBookmarks
                );
            }
        },

        // 요청 성공: 서버 데이터로 동기화
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.bookmarksList(collectionId),
            });
            // 컬렉션 캐시 초기화 (개수 업데이트)
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.collectionsList(),
            });
        },
    });
};

/**
 * 북마크 제거 (낙관적 업데이트)
 */
export const useRemoveBookmark = (collectionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookmarkId: string) => removeBookmark(bookmarkId),

        // 요청 전: 낙관적으로 캐시 업데이트
        onMutate: async (bookmarkId) => {
            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({
                queryKey: bookmarkKeys.bookmarksList(collectionId),
            });

            // 이전 데이터 백업
            const previousBookmarks = queryClient.getQueryData<Bookmark[]>(
                bookmarkKeys.bookmarksList(collectionId)
            );

            // 낙관적으로 제거
            if (previousBookmarks) {
                const filtered = previousBookmarks.filter((b) => b.id !== bookmarkId);
                queryClient.setQueryData(
                    bookmarkKeys.bookmarksList(collectionId),
                    filtered
                );
            }

            return { previousBookmarks };
        },

        // 요청 실패: 이전 데이터로 롤백
        onError: (_, __, context) => {
            if (context?.previousBookmarks) {
                queryClient.setQueryData(
                    bookmarkKeys.bookmarksList(collectionId),
                    context.previousBookmarks
                );
            }
        },

        // 요청 성공: 서버 데이터로 동기화
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.bookmarksList(collectionId),
            });
            // 컬렉션 캐시 초기화 (개수 업데이트)
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.collectionsList(),
            });
        },
    });
};

/**
 * 북마크 이동 (낙관적 업데이트)
 */
export const useMoveBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            bookmarkId,
            toCollectionId,
        }: {
            bookmarkId: string;
            toCollectionId: string;
        }) => moveBookmark(bookmarkId, toCollectionId),

        onSuccess: () => {
            // 모든 컬렉션의 북마크 목록 무효화
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.bookmarks(),
            });
            // 컬렉션 캐시 초기화 (개수 업데이트)
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.collectionsList(),
            });
        },
    });
};

/**
 * 북마크 순서 변경 (낙관적 업데이트)
 */
export const useReorderBookmarks = (collectionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: ReorderBookmarksRequest) =>
            reorderBookmarks(collectionId, request),

        // 요청 전: 낙관적으로 순서 변경
        onMutate: async (request) => {
            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({
                queryKey: bookmarkKeys.bookmarksList(collectionId),
            });

            // 이전 데이터 백업
            const previousBookmarks = queryClient.getQueryData<Bookmark[]>(
                bookmarkKeys.bookmarksList(collectionId)
            );

            // 낙관적으로 순서 변경
            if (previousBookmarks) {
                const bookmarkMap = new Map(previousBookmarks.map((b) => [b.id, b]));
                const reordered = request.bookmarkIds
                    .map((id) => bookmarkMap.get(id)!)
                    .map((b, index) => ({ ...b, sequence: index }))
                    .filter((b) => b !== undefined);

                queryClient.setQueryData(
                    bookmarkKeys.bookmarksList(collectionId),
                    reordered
                );
            }

            return { previousBookmarks };
        },

        // 요청 실패: 이전 데이터로 롤백
        onError: (_, __, context) => {
            if (context?.previousBookmarks) {
                queryClient.setQueryData(
                    bookmarkKeys.bookmarksList(collectionId),
                    context.previousBookmarks
                );
            }
        },

        // 요청 성공: 서버 데이터로 동기화
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bookmarkKeys.bookmarksList(collectionId),
            });
        },
    });
};
