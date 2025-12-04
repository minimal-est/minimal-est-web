import { useState } from "react";
import { addOrToggleReaction as toggleReactionApi, getArticleReactionStats, getMyReactions } from "@/entities/article-reaction/api";

interface UseToggleReactionResult {
    isLoading: boolean;
    toggleReaction: (reactionType: string) => Promise<void>;
}

/**
 * 반응 토글 훅 (Feature layer)
 * API 호출과 함께 최신 데이터를 refetch합니다
 * @param articleId - 아티클 ID
 * @param onSuccess - 토글 성공 시 콜백 (새로운 stats와 myReactions 전달)
 * @returns 토글 함수와 로딩 상태
 */
export const useToggleReaction = (
    articleId: string,
    onSuccess?: (stats: any, myReactions: any) => void
): UseToggleReactionResult => {
    const [isLoading, setIsLoading] = useState(false);

    const toggleReaction = async (reactionType: string) => {
        setIsLoading(true);
        try {
            // API 호출로 반응 토글
            await toggleReactionApi(articleId, reactionType);

            // 최신 데이터 조회
            const [stats, myReactions] = await Promise.all([
                getArticleReactionStats(articleId),
                getMyReactions(articleId),
            ]);

            onSuccess?.(stats, myReactions);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        toggleReaction,
    };
};
