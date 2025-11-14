interface ArticleHeaderProps {
    title: string;
}

export const ArticleHeader = ({ title }: ArticleHeaderProps) => {
    return (
        <h2 className="text-2xl font-bold tracking-tight truncate">
            {title}
        </h2>
    );
}