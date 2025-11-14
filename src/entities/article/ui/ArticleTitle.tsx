interface ArticleTitleProps {
    title: string;
}

export const ArticleTitle = ({ title }: ArticleTitleProps) => {
    return (
        <h2 className="text-3xl font-bold tracking-tight line-clamp-2">
            {title}
        </h2>
    );
}