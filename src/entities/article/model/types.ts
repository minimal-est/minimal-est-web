import type { JSONContent } from "@tiptap/core";

export type TiptapNode = JSONContent;

export interface AuthorInfo {
    authorId: string;
    penName: string;
}

// 리스트용 요약본
export interface ArticleSummary {
    articleId: string;
    title: string;
    description: string;
    publishedAt: Date;
    author: AuthorInfo;
}

// 상세 페이지용 (content 포함)
export interface ArticleDetail extends ArticleSummary {
    content: JSONContent[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface findSingleArticleParams {
    penName: string;
    articleId: string;
}

// 리스트 API 응답용 타입
export interface ArticleSummaryResponse extends Omit<ArticleSummary, 'publishedAt'> {
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    status: string;
}

// 상세 API 응답용 타입 (content는 JSON string)
export interface ArticleDetailResponse {
    articleId: string;
    title: string;
    description: string;
    content: string; // JSON string으로 받음
    status: string;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    author: AuthorInfo;
}

// 내 글 관리용 타입
export interface MyArticleSummary extends ArticleSummary {
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MyArticlesResponse {
    content: MyArticleSummary[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export type ArticleStatusFilter = 'DRAFT' | 'PUBLISHED' | 'ALL';
