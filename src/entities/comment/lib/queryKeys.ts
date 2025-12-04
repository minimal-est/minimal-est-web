/**
 * React Query 캐시 키 팩토리
 */
export const commentKeys = {
    all: ['comments'] as const,

    lists: () => [...commentKeys.all, 'list'] as const,

    list: (articleId: string) => [...commentKeys.lists(), articleId] as const,

    listWithParams: (articleId: string, page: number, limit: number, sort: string) =>
        [...commentKeys.list(articleId), { page, limit, sort }] as const,

    details: () => [...commentKeys.all, 'detail'] as const,

    detail: (articleId: string, commentId: string) =>
        [...commentKeys.details(), articleId, commentId] as const,
};
