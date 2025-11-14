import { useQuery } from "@tanstack/react-query";
import { fetchRecommendArticles, fetchSingleArticle } from "./articleApi";
import type { findSingleArticleParams } from "../model/types";
import { articleKeys } from "./queryKeys";

/**
 * 추천 아티클 목록을 조회하는 hook
 * @returns useQuery 반환값
 */
export const useRecommendArticles = () => {
    return useQuery({
        queryKey: articleKeys.recommendations(),
        queryFn: fetchRecommendArticles,
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
    });
};

/**
 * 단일 아티클을 조회하는 hook
 * @param params - penName, articleId를 포함한 파라미터
 * @param enabled - 쿼리 실행 여부 (기본값: true)
 * @returns useQuery 반환값
 */
export const useSingleArticle = (
    params: findSingleArticleParams,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: articleKeys.singleDetail(params),
        queryFn: () => fetchSingleArticle(params),
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
        enabled,
    });
};
