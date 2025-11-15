import { client } from "@/shared/api";
import type { ArticleDetail, ArticleSummary, ArticleSummaryResponse, ArticleDetailResponse, findSingleArticleParams, MyArticlesResponse, ArticleStatusFilter } from "../model/types";
import type { JSONContent } from "@tiptap/core";

/**
 * 추천 아티클 목록 조회
 * @throws {ErrorResponse} API 에러
 */
export const fetchRecommendArticles = async (): Promise<ArticleSummary[]> => {
    const response = await client.get<{ articleSummaries: ArticleSummaryResponse[] }>("/articles/recommend");
    return response.data.articleSummaries.map(article => ({
        articleId: article.articleId,
        title: article.title,
        description: article.description,
        publishedAt: new Date(article.publishedAt),
        author: article.author,
    }));
};

/**
 * 단일 아티클 조회 (상세 페이지)
 * @param params - penName, articleId를 포함한 파라미터
 * @throws {ErrorResponse} API 에러
 */
export const fetchSingleArticle = async (params: findSingleArticleParams): Promise<ArticleDetail> => {
    const { articleId } = params;
    const response = await client.get<ArticleDetailResponse>(`/blogs/${params.penName}/articles/${articleId}/details`);

    let parsedContent: JSONContent[] = [];

    try {
        let content: any = JSON.parse(response.data.content);

        // doc으로 감싸져 있으면 추출, 배열이면 그대로 사용
        if (content?.type === 'doc' && Array.isArray(content.content)) {
            parsedContent = content.content;
        } else if (Array.isArray(content)) {
            parsedContent = content;
        }
    } catch (e) {
        // 파싱 실패하면 빈 배열
        parsedContent = [];
    }

    return {
        articleId: response.data.articleId,
        title: response.data.title,
        description: response.data.description,
        content: parsedContent,
        status: response.data.status,
        publishedAt: new Date(response.data.publishedAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        author: response.data.author,
    };
};

/**
 * 글 생성 (빈 상태)
 * @param blogId - 블로그 ID
 * @returns { articleId }
 * @throws {ErrorResponse} API 에러
 */
export const createArticle = async (blogId: string): Promise<{ articleId: string }> => {
    const response = await client.post<{ articleId: string }>(`/blogs/${blogId}/articles`);
    return response.data;
};

/**
 * 글 업데이트 (유효성 검사 없음)
 * @param blogId - 블로그 ID
 * @param articleId - 아티클 ID
 * @param title - 제목
 * @param content - 내용
 * @throws {ErrorResponse} API 에러
 */
export const updateArticle = async (
    blogId: string,
    articleId: string,
    title: string,
    content: JSONContent[],
    description: string,
): Promise<{ articleId: string; title: string; description: string }> => {
    const response = await client.put<{ articleId: string; title: string; description: string; }>(
        `/blogs/${blogId}/articles/${articleId}`,
        {
            title,
            content: JSON.stringify(content),
            description,
        }
    );
    return response.data;
};

/**
 * 글 발행 (유효성 검사 후 발행)
 * @param blogId - 블로그 ID
 * @param articleId - 아티클 ID
 * @throws {ErrorResponse} API 에러
 */
export const completeArticle = async (
    blogId: string,
    articleId: string
): Promise<{ articleId: string }> => {
    const response = await client.post<{ articleId: string }>(
        `/blogs/${blogId}/articles/${articleId}/publish`
    );
    return response.data;
};

/**
 * 내 글 목록 조회
 * @param blogId - 블로그 ID
 * @param status - DRAFT | PUBLISHED | ALL (기본값: ALL)
 * @param search - 제목 검색어
 * @param page - 페이지 (0부터 시작)
 * @param size - 페이지당 항목 수
 * @throws {ErrorResponse} API 에러
 */
export const fetchMyArticles = async (
    blogId: string,
    status: ArticleStatusFilter = 'ALL',
    search: string = '',
    page: number = 0,
    size: number = 10
): Promise<MyArticlesResponse> => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') {
        params.append('status', status);
    }
    if (search) {
        params.append('search', search);
    }
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await client.get<any>(
        `/blogs/${blogId}/articles/my?${params.toString()}`
    );

    // API 응답을 MyArticlesResponse 형식으로 변환
    const articlesData = response.data.articles || response.data;
    const pageInfo = articlesData.page || {};

    return {
        content: articlesData.content.map((article: any) => ({
            articleId: article.articleId,
            title: article.title,
            description: article.description,
            publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(article.createdAt),
            status: article.status,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
            author: article.author,
        })),
        totalElements: pageInfo.totalElements || 0,
        totalPages: pageInfo.totalPages || 0,
        currentPage: pageInfo.number || 0,
        pageSize: pageInfo.size || 10,
    };
};

/**
 * 글 삭제 (소프트 삭제)
 * @param blogId - 블로그 ID
 * @param articleId - 아티클 ID
 * @throws {ErrorResponse} API 에러
 */
export const deleteArticle = async (
    blogId: string,
    articleId: string
): Promise<void> => {
    await client.delete(`/blogs/${blogId}/articles/${articleId}`);
};
