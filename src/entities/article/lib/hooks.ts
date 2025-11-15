import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { findSingleArticleParams, ArticleStatusFilter } from "../model/types";
import { articleKeys } from "./queryKeys";
import { fetchRecommendArticles, fetchSingleArticle, fetchMyArticles, deleteArticle } from "../api";

/**
 * 추천 아티클 목록을 조회하는 hook
 */
export const useRecommendArticles = () => {
    return useQuery({
        queryKey: articleKeys.recommendations(),
        queryFn: fetchRecommendArticles,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

/**
 * 단일 아티클(상세) 조회 hook
 * @param params - penName, articleId를 포함한 파라미터
 * @param enabled - 쿼리 실행 여부 (기본값: true)
 */
export const useSingleArticle = (
    params: findSingleArticleParams,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: articleKeys.singleDetail(params),
        queryFn: () => fetchSingleArticle(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled,
    });
};

/**
 * 내 글 목록 조회 hook
 */
export const useMyArticles = (
    blogId: string,
    status: ArticleStatusFilter = 'ALL',
    search: string = '',
    page: number = 0,
    size: number = 10
) => {
    return useQuery({
        queryKey: articleKeys.myArticles(blogId, status, search, page, size),
        queryFn: () => fetchMyArticles(blogId, status, search, page, size),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};

/**
 * 글 삭제 hook
 */
export const useDeleteArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ blogId, articleId }: { blogId: string; articleId: string }) =>
            deleteArticle(blogId, articleId),
        onSuccess: (_, { blogId }) => {
            // 내 글 목록 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: ['articles', 'my', blogId],
                exact: false,
            });
        },
    });
};
