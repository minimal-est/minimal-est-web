import type { findSingleArticleParams } from "../model/types";

export const articleKeys = {
    all: ["articles"] as const,
    recommendations: () => [...articleKeys.all, "recommendations"] as const,
    single: () => [...articleKeys.all, "single"] as const,
    singleDetail: (params: findSingleArticleParams) =>
        [...articleKeys.single(), params.penName, params.articleId] as const,
};
