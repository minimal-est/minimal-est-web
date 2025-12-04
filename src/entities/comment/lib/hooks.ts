import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
    fetchComments,
    createMemberComment,
    createGuestComment,
    deleteMemberComment,
    deleteGuestComment,
} from "../api";
import { commentKeys } from "./queryKeys";
import type { CommentQueryParams, MemberCommentRequest, GuestCommentRequest } from "../model";

const DEFAULT_LIMIT = 10;

/**
 * 댓글 목록 조회 (pagination)
 * @param articleId - 아티클 ID
 * @param params - 조회 파라미터
 */
export const useComments = (articleId: string, params?: CommentQueryParams) => {
    return useQuery({
        queryKey: commentKeys.listWithParams(
            articleId,
            params?.page ?? 0,
            params?.limit ?? DEFAULT_LIMIT,
            params?.sort ?? 'LATEST'
        ),
        queryFn: () => fetchComments(articleId, params),
        staleTime: 1000 * 60 * 5, // 5분
    });
};

/**
 * 댓글 목록 조회 (infinite scroll / "더 불러오기")
 * @param articleId - 아티클 ID
 * @param limit - 한 번에 불러올 댓글 수
 * @param sort - 정렬 순서
 */
export const useInfiniteComments = (
    articleId: string,
    limit: number = DEFAULT_LIMIT,
    sort: 'LATEST' | 'POPULAR' = 'LATEST'
) => {
    return useInfiniteQuery({
        queryKey: commentKeys.list(articleId),
        queryFn: ({ pageParam = 0 }) =>
            fetchComments(articleId, { page: pageParam, limit, sort }),
        getNextPageParam: (lastPage, allPages) => {
            // 마지막 페이지에서 반환된 댓글 수가 limit보다 적으면 다음 페이지 없음
            if (lastPage.length < limit) return undefined;
            return allPages.length; // 다음 페이지 번호
        },
        initialPageParam: 0,
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * 회원 댓글 작성
 */
export const useCreateMemberComment = (articleId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: MemberCommentRequest) =>
            createMemberComment(articleId, request),
        onSuccess: () => {
            // 댓글 목록 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: commentKeys.list(articleId),
                exact: false,
            });
        },
    });
};

/**
 * 비회원 댓글 작성
 */
export const useCreateGuestComment = (articleId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: GuestCommentRequest) =>
            createGuestComment(articleId, request),
        onSuccess: () => {
            // 댓글 목록 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: commentKeys.list(articleId),
                exact: false,
            });
        },
    });
};

/**
 * 회원 댓글 삭제
 */
export const useDeleteMemberComment = (articleId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) =>
            deleteMemberComment(articleId, commentId),
        onSuccess: () => {
            // 댓글 목록 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: commentKeys.list(articleId),
                exact: false,
            });
        },
    });
};

/**
 * 비회원 댓글 삭제
 */
export const useDeleteGuestComment = (articleId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, password }: { commentId: string; password: string }) =>
            deleteGuestComment(articleId, commentId, password),
        onSuccess: () => {
            // 댓글 목록 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: commentKeys.list(articleId),
                exact: false,
            });
        },
    });
};
