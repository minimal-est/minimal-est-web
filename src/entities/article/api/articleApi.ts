import { client } from "@/shared/api";
import type {
    ArticleDetail,
    ArticleSummary,
    ArticleSummaryResponse,
    ArticleDetailResponse,
    findSingleArticleParams,
    MyArticlesResponse,
    ArticlesResponse,
    ArticleStatusFilter,
    PrevAndNextArticleSummary,
    UpdateArticleRequest
} from "../model/types";
import type { JSONContent } from "@tiptap/core";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/shared/constants";

/**
 * 추천 아티클 목록 조회
 * @throws {ErrorResponse} API 에러
 */
export const fetchRecommendArticles = async (): Promise<ArticleSummary[]> => {
    const response = await client.get<{ articleSummaries: ArticleSummaryResponse[] }>("/articles/recommend");
    return response.data.articleSummaries.map((article: any) => ({
        articleId: article.articleId,
        slug: article.slug,
        title: article.title,
        description: article.description,
        publishedAt: new Date(article.publishedAt),
        author: article.author,
        reactionStats: article.reactionStats,
        tags: Array.isArray(article.tags) ? article.tags.map((t: any) => t.name) : [],
    }));
};

/**
 * 추천 아티클 목록 조회 (무한스크롤용)
 * @param page - 페이지 번호 (0부터 시작)
 * @param limit - 페이지당 항목 수
 * @returns ArticlesResponse - 페이지네이션된 글 목록
 * @throws {ErrorResponse} API 에러
 */
export const fetchRecommendArticlesWithPagination = async (
    page: number,
    limit: number
): Promise<ArticlesResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await client.get<any>(`/articles/recommend?${params.toString()}`);

    const articles = response.data.articleSummaries || [];

    return {
        content: articles.map((article: any) => ({
            articleId: article.articleId,
            slug: article.slug,
            title: article.title,
            description: article.description,
            publishedAt: new Date(article.publishedAt),
            author: article.author,
            reactionStats: article.reactionStats,
            tags: Array.isArray(article.tags) ? article.tags.map((t: any) => t.name) : [],
        })),
        totalElements: 0,
        totalPages: 0,
        currentPage: page,
        pageSize: limit,
        // 받은 글이 limit보다 적으면 마지막 페이지
        hasMore: articles.length >= limit,
    };
};

/**
 * Slug로 단일 아티클 조회 (상세 페이지)
 *
 * @param penName - 작가 필명
 * @param slug - 글의 slug
 * @returns 글 상세 정보 (콘텐츠 포함)
 * @throws {ErrorResponse} API 에러 (404: 글 없음 등)
 */
export const fetchArticleBySlug = async (
    penName: string,
    slug: string
): Promise<ArticleDetail> => {
    const response = await client.get<ArticleDetailResponse>(
        `/blogs/${penName}/articles/by-slug/${slug}/details`
    );

    /**
     * API에서 받은 콘텐츠는 JSON 문자열로 직렬화되어 있음
     * 두 가지 형식으로 저장될 수 있음:
     *
     * 형식 1 - Tiptap 기본 구조 (단일 루트 노드):
     *   { type: 'doc', content: [...] }
     *
     * 형식 2 - 직렬화된 배열 (호환성):
     *   [...]
     *
     *
     * 이 함수는 두 형식을 모두 처리하고 표준화된 JSONContent[] 배열로 반환
     */
    let parsedContent: JSONContent[] = [];

    try {
        const content = JSON.parse(response.data.content);

        if (content?.type === 'doc' && Array.isArray(content.content)) {
            // 형식 1: Tiptap doc 구조에서 내용 배열 추출
            parsedContent = content.content;
        } else if (Array.isArray(content)) {
            // 형식 2: 이미 배열 형식
            parsedContent = content;
        }
    } catch (_parseError) {
        // JSON 파싱 실패 시 빈 배열로 처리
        // (향후 에러 로깅 추가 권장)
        console.log(_parseError);
        parsedContent = [];
    }

    return {
        articleId: response.data.articleId,
        slug: response.data.slug || "",
        title: response.data.title,
        description: response.data.description,
        content: parsedContent,
        status: response.data.status,
        publishedAt: new Date(response.data.publishedAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        author: response.data.author,
        tags: Array.isArray(response.data.tags) ? response.data.tags.map((t: any) => t.name) : [],
    };
};

/**
 * 단일 아티클 조회 (상세 페이지)
 *
 * @param params - { penName: 작가 필명, articleId: 글 ID }
 * @returns 글 상세 정보 (콘텐츠 포함)
 * @throws {ErrorResponse} API 에러 (404: 글 없음, 403: 접근 권한 없음 등)
 */
export const fetchSingleArticle = async (
    params: findSingleArticleParams
): Promise<ArticleDetail> => {
    const { articleId } = params;
    const response = await client.get<ArticleDetailResponse>(
        `/blogs/${params.penName}/articles/${articleId}/details`
    );

    /**
     * API에서 받은 콘텐츠는 JSON 문자열로 직렬화되어 있음
     * 두 가지 형식으로 저장될 수 있음:
     *
     * 형식 1 - Tiptap 기본 구조 (단일 루트 노드):
     *   { type: 'doc', content: [...] }
     *
     * 형식 2 - 직렬화된 배열 (호환성):
     *   [...]
     *
     *
     * 이 함수는 두 형식을 모두 처리하고 표준화된 JSONContent[] 배열로 반환
     */
    let parsedContent: JSONContent[] = [];

    try {
        const content = JSON.parse(response.data.content);

        if (content?.type === 'doc' && Array.isArray(content.content)) {
            // 형식 1: Tiptap doc 구조에서 내용 배열 추출
            parsedContent = content.content;
        } else if (Array.isArray(content)) {
            // 형식 2: 이미 배열 형식
            parsedContent = content;
        }
    } catch (_parseError) {
        // JSON 파싱 실패 시 빈 배열로 처리
        // (향후 에러 로깅 추가 권장)
        console.log(_parseError);
        parsedContent = [];
    }

    return {
        articleId: response.data.articleId,
        slug: response.data.slug || "",
        title: response.data.title,
        description: response.data.description,
        content: parsedContent,
        status: response.data.status,
        publishedAt: new Date(response.data.publishedAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        author: response.data.author,
        tags: Array.isArray(response.data.tags) ? response.data.tags.map((t: any) => t.name) : [],
    };
};

/**
 * 해당 아티클 기준으로 이전, 다음 발행된 아티클 조회
 * 없으면 null이 반환됨
 * @param articleId 기준 아티클
 * @returns 이전, 다음 글
 */
export const fetchPrevAndNextArticle = async (articleId: string): Promise<PrevAndNextArticleSummary> => {
    const response = await client.get<any>(`/articles/${articleId}/prev-and-next`);
    return response.data;
}

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
export const updateArticle = async ({
        blogId,
        articleId,
        title,
        content,
        pureContent,
        description,
        tags
    }: UpdateArticleRequest): Promise<{ articleId: string; }> => {
    const response = await client.put<{ articleId: string; title: string; description: string; }>(
        `/blogs/${blogId}/articles/${articleId}`,
        {
            title,
            content: JSON.stringify(content),
            pureContent,
            description,
            tags
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
 * @param search - 제목 검색어 (기본값: '')
 * @param page - 페이지 번호 (0부터 시작, 기본값: 0)
 * @param size - 페이지당 항목 수 (기본값: 10)
 * @returns MyArticlesResponse - 페이지네이션된 글 목록
 * @throws {ErrorResponse} API 에러
 */
export const fetchMyArticles = async (
    blogId: string,
    status: ArticleStatusFilter = 'ALL',
    search: string = '',
    page: number = DEFAULT_PAGE_NUMBER,
    size: number = DEFAULT_PAGE_SIZE
): Promise<MyArticlesResponse> => {
    const params = new URLSearchParams();

    // ALL이 아닌 경우에만 상태 필터 추가
    if (status && status !== 'ALL') {
        params.append('status', status);
    }

    // 검색어가 있는 경우에만 추가
    if (search) {
        params.append('search', search);
    }

    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await client.get<any>(
        `/blogs/${blogId}/articles/my?${params.toString()}`
    );

    /**
     * API 응답 구조가 불일치할 수 있음:
     * - response.data.articles 존재: { articles: { content: [], page: { ... } } }
     * - response.data 직접: { content: [], page: { ... } }
     *
     * 두 구조 모두 처리하기 위해 OR 연산자 사용
     */
    const articlesData = response.data.articles || response.data;
    const pageInfo = articlesData.page || {};

    return {
        content: articlesData.content.map((article: any) => ({
            articleId: article.articleId,
            slug: article.slug || "",
            title: article.title,
            description: article.description,
            publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(article.createdAt),
            status: article.status,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
            author: article.author,
            tags: Array.isArray(article.tags) ? article.tags.map((t: any) => t.name) : [],
        })),
        totalElements: pageInfo.totalElements || 0,
        totalPages: pageInfo.totalPages || 0,
        currentPage: pageInfo.number || DEFAULT_PAGE_NUMBER,
        pageSize: pageInfo.size || DEFAULT_PAGE_SIZE,
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

/**
 * 글 검색
 * @param query - 검색어
 * @param page - 페이지 번호 (0부터 시작, 기본값: 0)
 * @param size - 페이지당 항목 수 (기본값: 15)
 * @returns ArticlesResponse - 페이지네이션된 검색 결과
 * @throws {ErrorResponse} API 에러
 */
export const searchArticles = async (
    query: string,
    page: number = DEFAULT_PAGE_NUMBER,
    size: number = DEFAULT_PAGE_SIZE
): Promise<ArticlesResponse> => {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await client.get<any>(
        `/articles/search?${params.toString()}`
    );

    const articlesData = response.data.articles;
    const pageInfo = articlesData.page;

    return {
        content: articlesData.content.map((article: any) => ({
            articleId: article.articleId,
            slug: article.slug || "",
            title: article.title,
            description: article.description,
            publishedAt: new Date(article.publishedAt),
            author: article.author,
            tags: Array.isArray(article.tags) ? article.tags.map((t: any) => t.name) : [],
        })),
        totalElements: pageInfo.totalElements,
        totalPages: pageInfo.totalPages,
        currentPage: pageInfo.number,
        pageSize: pageInfo.size,
    };
};
