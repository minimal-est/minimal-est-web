export const userQueryKeys = {
    all: ['user'] as const,
    blogInfo: () => [...userQueryKeys.all, 'blogInfo'] as const,
    blogInfoByPenName: (penName: string) => [...userQueryKeys.all, 'blogInfo', penName] as const,
}