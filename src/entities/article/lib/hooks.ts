import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import type { findSingleArticleParams, ArticleStatusFilter } from "../model/types";
import { articleKeys } from "./queryKeys";
import { fetchRecommendArticles, fetchRecommendArticlesWithPagination, fetchSingleArticle, fetchArticleBySlug, fetchMyArticles, deleteArticle, fetchPrevAndNextArticle, searchArticles, fetchBlogArticles } from "../api";

/**
 * 추천 아티클 목록을 조회하는 hook (기존)
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
 * 추천 아티클 무한스크롤 hook
 * @param limit - 페이지당 항목 수 (기본값: 15)
 */
export const useInfiniteRecommendArticles = (limit: number = 15) => {
    return useInfiniteQuery({
        queryKey: articleKeys.recommendationsInfinite(limit),
        queryFn: ({ pageParam = 0 }) => fetchRecommendArticlesWithPagination(pageParam, limit),
        getNextPageParam: (lastPage) => {
            // hasMore가 true이면 다음 페이지 존재
            if (lastPage.hasMore) {
                return lastPage.currentPage + 1;
            }
            return undefined;
        },
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

/**
 * 단일 아티클(상세) 조회 hook (slug 기반)
 * @param penName - 작가 필명
 * @param slug - 글의 slug
 * @param enabled - 쿼리 실행 여부 (기본값: true)
 */
export const useSingleArticleBySlug = (
    penName: string,
    slug: string,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: articleKeys.singleDetailBySlug(penName, slug),
        queryFn: () => fetchArticleBySlug(penName, slug),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 0,
        enabled,
    });
};

/**
 * 단일 아티클(상세) 조회 hook (articleId 기반 - draft 조회용)
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
        retry: 0,
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

/**
 * 이전, 다음 글 조회 hook
 */
export const usePrevAndNextArticles = (articleId: string) => {
    return useQuery({
        queryKey: articleKeys.prevAndNext(articleId),
        queryFn: () => fetchPrevAndNextArticle(articleId),
        staleTime: 1000 * 60 * 30,
    });
};

/**
 * 글 검색 hook
 * @param query - 검색어
 * @param page - 페이지 번호
 * @param size - 페이지당 항목 수
 */
export const useSearchArticles = (
    query: string,
    page: number = 0,
    size: number = 15
) => {
    return useQuery({
        queryKey: articleKeys.search(query, page, size),
        queryFn: () => searchArticles(query, page, size),
        enabled: !!query,
        staleTime: 1000 * 60 * 5,
        retry: 0
    });
};

/**
 * 블로그 글 목록 조회 hook
 * @param penName - 필자 필명
 * @param page - 페이지 번호
 * @param size - 페이지당 항목 수
 */
export const useBlogArticles = (
    penName: string,
    page: number = 0,
    size: number = 10
) => {
    return useQuery({
        queryKey: ['articles', 'blog', penName, page, size],
        queryFn: () => fetchBlogArticles(penName, page, size),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};