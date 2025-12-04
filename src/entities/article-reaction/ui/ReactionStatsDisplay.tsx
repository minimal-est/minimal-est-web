import type { ArticleReactionStats, MyReactionResponse } from "../model";
import { REACTION_CONFIG } from "../lib/reactionConfig";
import { Skeleton } from "@/shared/ui/base";

interface ReactionStatsDisplayProps {
    articleId: string;
    stats: ArticleReactionStats | null;
    myReactions: MyReactionResponse | null;
    isLoading: boolean;
    error: string | null;
    onReactionClick?: (reactionType: string) => void;
    isTogglingLoading?: boolean;
    variant?: "full" | "compact";
}

/**
 * 반응 통계를 표시합니다 (순수 UI 컴포넌트)
 * 데이터는 모두 props로 수신
 */
export const ReactionStatsDisplay = ({
    articleId: _articleId,
    stats,
    myReactions,
    isLoading,
    error,
    onReactionClick,
    isTogglingLoading,
    variant = "full",
}: ReactionStatsDisplayProps) => {

    // 사용자가 한 반응 타입들
    const myReactionTypes = new Set(
        myReactions?.reactions
            .filter((reaction) => reaction.reactionState === "REACTED")
            .map((reaction) => reaction.reactionType) || []
    );

    if (error) {
        return (
            <div className="text-sm text-red-600 dark:text-red-400">
                {error}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                ))}
            </div>
        );
    }

    if (!stats || Object.keys(stats.stats).length === 0) {
        return (
            <div className="text-sm text-gray-500 dark:text-gray-400">
                아직 반응이 없습니다
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <div className="flex gap-2">
                {Object.entries(stats.stats).map(([type, count]) => {
                    const config = REACTION_CONFIG[type];

                    if (count === 0) return null;

                    return (
                        <button
                            key={type}
                            onClick={() => onReactionClick?.(type)}
                            disabled={isTogglingLoading}
                            className="flex items-center gap-1 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-70"
                            title={config?.label || type}
                        >
                            <span className="text-base">{config?.emoji || "◆"}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="flex gap-3 text-sm">
            {Object.entries(stats.stats).map(([type, count]) => {
                const config = REACTION_CONFIG[type];
                const isMyReaction = myReactionTypes.has(type);

                return (
                    <button
                        key={type}
                        onClick={() => onReactionClick?.(type)}
                        disabled={isTogglingLoading}
                        className={`
                            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                            transition-colors cursor-pointer
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${
                                isMyReaction
                                    ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }
                        `}
                    >
                        <span className="text-base">{config?.emoji || "◆"}</span>
                        <span className="text-xs">{config?.label || type}</span>
                        <span className={isMyReaction ? "text-violet-600 dark:text-violet-300" : "text-gray-500 dark:text-gray-500"}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
