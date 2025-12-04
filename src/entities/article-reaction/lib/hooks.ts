import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getArticleReactionStats, getMyReactions } from "../api";
import { reactionKeys } from "./queryKeys";
import { useAuth } from "@/entities/user/lib";

export const useArticleReactions = (articleId: string) => {
    const queryClient = useQueryClient();
    const { isSignedIn } = useAuth();

    const statsQuery = useQuery({
        queryKey: reactionKeys.statsForArticle(articleId),
        queryFn: () => getArticleReactionStats(articleId),
        staleTime: 1000 * 60 * 5, // 5분
    });

    // 로그인한 사용자만 자신의 리액션 정보를 조회
    const myReactionsQuery = useQuery({
        queryKey: reactionKeys.myReactionsForArticle(articleId),
        queryFn: () => getMyReactions(articleId),
        staleTime: 1000 * 60 * 5, // 5분
        enabled: isSignedIn,
    });

    const refetch = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: reactionKeys.statsForArticle(articleId),
            }),
            queryClient.invalidateQueries({
                queryKey: reactionKeys.myReactionsForArticle(articleId),
            }),
        ]);
    };

    return {
        stats: statsQuery.data || null,
        myReactions: myReactionsQuery.data || null,
        isLoading: statsQuery.isLoading || myReactionsQuery.isLoading,
        error: statsQuery.error?.message || myReactionsQuery.error?.message || null,
        refetch,
    };
};