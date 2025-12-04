/**
 * 반응 통계: 반응 타입별 카운트
 * 예: { READ: 10, AGREE: 5, DISAGREE: 2 }
 */
export interface ArticleReactionStats {
    stats: Record<string, number>;
}

/**
 * 개별 반응 정보 (사용자가 한 반응)
 */
export interface MyReactionDetail {
    reactionId: string;
    reactionType: string;
    reactionState: "REACTED" | "CANCELED";
    reactAt: string;
}

/**
 * 사용자의 반응 목록
 */
export interface MyReactionResponse {
    reactions: MyReactionDetail[];
}