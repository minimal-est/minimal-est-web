import { client } from "@/shared/api";
import type { ArticleSummary, ArticleResponse, findSingleArticleParams } from "../model/types";

/**
 * 추천 아티클 목록 조회
 * @throws {ErrorResponse} API 에러
 */
export const fetchRecommendArticles = async (): Promise<ArticleSummary[]> => {
    const response = await client.get<ArticleResponse[]>("/articles/recommend");

    return response.data.map(article => ({
        ...article,
        completedAt: new Date(article.completedAt)
    }));
};

/**
 * 단일 아티클 조회
 * @param params - penName, articleId를 포함한 파라미터
 * @throws {ErrorResponse} API 에러
 */
export const fetchSingleArticle = async (params: findSingleArticleParams): Promise<ArticleSummary> => {
    const { articleId } = params;
    const response = await client.get<ArticleResponse>(`/blogs/${params.penName}/articles/${articleId}`);

    return {
        ...response.data,
        completedAt: new Date(response.data.completedAt)
    };
};