import { useNavigate } from "react-router-dom";
import { ReactionStatsDisplay, useArticleReactions } from "@/entities/article-reaction";
import { useToggleReaction } from "../lib";
import { useAuth } from "@/entities/user/lib";
import { toast } from "sonner";

interface ReactionStatsSectionProps {
    articleId: string;
    showCompact?: boolean;
}

/**
 * Feature layer - 반응 표시 및 사용자 상호작용 처리
 * - Entity의 ReactionStatsDisplay로 표시
 * - 사용자 상호작용 처리 (토글)
 * - API 호출로 반응 추가/제거
 */
export const ReactionStatsSection = ({
    articleId,
    showCompact = false,
}: ReactionStatsSectionProps) => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    // Entity hook에서 모든 상태 관리
    const { stats, myReactions, isLoading: reactionIsLoading, error, refetch } = useArticleReactions(articleId);

    const { isLoading, toggleReaction } = useToggleReaction(
        articleId,
        () => {
            // 토글 성공 후 반응 데이터 새로고침
            refetch();
        }
    );

    const handleReactionClick = async (reactionType: string) => {
        if (!accessToken) {
            toast.error("로그인이 필요합니다");
            navigate("/login");
            return;
        }

        try {
            await toggleReaction(reactionType);
        } catch (error) {
            console.error("Failed to toggle reaction:", error);
            toast.error("반응을 처리할 수 없습니다");
        }
    };

    return (
        <>
            {/* showCompact=true: compact만 표시 (헤더) */}
            {showCompact && (
                <div className="my-3">
                    <ReactionStatsDisplay
                        articleId={articleId}
                        onReactionClick={handleReactionClick}
                        isTogglingLoading={isLoading}
                        variant="compact"
                        stats={stats}
                        myReactions={myReactions}
                        isLoading={reactionIsLoading}
                        error={error}
                    />
                </div>
            )}

            {/* showCompact=false: full만 표시 (푸터) */}
            {!showCompact && (
                <div>
                    <ReactionStatsDisplay
                        articleId={articleId}
                        onReactionClick={handleReactionClick}
                        isTogglingLoading={isLoading}
                        variant="full"
                        stats={stats}
                        myReactions={myReactions}
                        isLoading={reactionIsLoading}
                        error={error}
                    />
                </div>
            )}
        </>
    );
};
