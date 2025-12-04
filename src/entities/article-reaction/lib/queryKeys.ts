export const reactionKeys = {
    all: ["reactions"] as const,
    stats: () => [...reactionKeys.all, "stats"] as const,
    statsForArticle: (articleId: string) => [...reactionKeys.stats(), articleId] as const,
    myReactions: () => [...reactionKeys.all, "myReactions"] as const,
    myReactionsForArticle: (articleId: string) => [...reactionKeys.myReactions(), articleId] as const,
};
