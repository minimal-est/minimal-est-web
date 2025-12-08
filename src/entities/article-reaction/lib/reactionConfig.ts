/**
 * 반응 타입별 설정 (이모지, 라벨, 아이콘 등)
 */
export const REACTION_CONFIG: Record<string, { emoji: string; label: string; icon: string }> = {
    USEFUL: { emoji: "👍", label: "유용해요", icon: "lightbulb" },
    AGREE: { emoji: "❤️", label: "공감해요", icon: "heart" },
    READ: { emoji: "👀", label: "잘 읽었어요", icon: "thumbsup" },
};

/**
 * 반응 타입 목록
 */
export const REACTION_TYPES = Object.keys(REACTION_CONFIG);
