import { client } from "@/shared/api"
import type { ArticleReactionStats, MyReactionResponse } from "../model/types";

/**
 * 아티클의 반응 통계를 조회합니다
 * @param articleId - 아티클 ID
 * @returns 반응 타입별 카운트 { READ: 10, AGREE: 5, ... }
 */
export const getArticleReactionStats = async (articleId: string): Promise<ArticleReactionStats> => {
    const response = await client.get<ArticleReactionStats>(`/articles/${articleId}/reactions/stats`);
    return response.data;
};

/**
 * 사용자가 한 반응들을 조회합니다
 * @param articleId - 아티클 ID
 * @returns 사용자의 모든 활성 반응 목록
 */
export const getMyReactions = async (articleId: string): Promise<MyReactionResponse> => {
    const response = await client.get<MyReactionResponse>(`/articles/${articleId}/reactions/self`);
    return response.data;
};

/**
 * 반응을 추가하거나 토글합니다 (이미 반응했으면 취소)
 * @param articleId - 아티클 ID
 * @param reactionType - 반응 타입 (USEFUL, AGREE, READ)
 * @returns 업데이트된 사용자의 반응 목록
 */
export const addOrToggleReaction = async (
    articleId: string,
    reactionType: string
): Promise<MyReactionResponse> => {
    const response = await client.post<MyReactionResponse>(
        `/articles/${articleId}/reactions`,
        { reactionType }
    );
    return response.data;
};