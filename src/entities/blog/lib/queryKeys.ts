export const blogKeys = {
    all: ["blog"] as const,
    details: (penName: string) => [...blogKeys.all, penName] as const
};
