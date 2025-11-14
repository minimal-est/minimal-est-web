interface ArticlePublishedDateProps {
    publishedDate: Date;
}

const ArticlePublishedDate = ({ publishedDate }: ArticlePublishedDateProps) => {
    const now = new Date();
    const diffMs = now.getTime() - publishedDate.getTime();

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let display = "";

    if (diffHours < 1) {
        // 1시간 미만 → 분 단위
        display = `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
        // 하루 미만 → 시간 단위
        display = `${diffHours}시간 전`;
    } else if (diffDays < 365) {
        // 1년 미만 → 일 단위
        display = `${diffDays}일 전`;
    } else {
        // 1년 이상 → 년 단위
        const years = Math.floor(diffDays / 365);
        display = `${years}년 전`;
    }

    return (
        <span className="text-sm text-muted-foreground">
            {display}
        </span>
    );
};
export default ArticlePublishedDate;