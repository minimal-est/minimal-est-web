import type { findSingleArticleParams, ArticleStatusFilter } from "../model/types";

export const articleKeys = {
    all: ["articles"] as const,
    recommendations: () => [...articleKeys.all, "recommendations"] as const,
    single: () => [...articleKeys.all, "single"] as const,
    singleDetail: (params: findSingleArticleParams) =>
        [...articleKeys.single(), params.penName, params.articleId] as const,
    my: (blogId: string) => [...articleKeys.all, "my", blogId] as const,
    myArticles: (blogId: string, status: ArticleStatusFilter, search: string, page: number, size: number) =>
        [...articleKeys.my(blogId), { status, search, page, size }] as const,
};
