/**
 * 반응 타입별 설정 (이모지, 라벨 등)
 */
export const REACTION_CONFIG: Record<string, { emoji: string; label: string }> = {
    USEFUL: { emoji: "👍", label: "유용해요" },
    AGREE: { emoji: "❤️", label: "공감해요" },
    READ: { emoji: "👀", label: "잘 읽었어요" },
};

/**
 * 반응 타입 목록
 */
export const REACTION_TYPES = Object.keys(REACTION_CONFIG);
