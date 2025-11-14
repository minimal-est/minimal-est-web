import type { JSONContent } from "@tiptap/core";

export type TiptapNode = JSONContent;

export interface ArticleSummary {
    articleId: string;
    title: string;
    content: JSONContent[];
    description: string;
    completedAt: Date;
    author: AuthorInfo;
}

export interface AuthorInfo {
    userId: string;
    penName: string;
}

export interface findSingleArticleParams {
    penName: string;
    articleId: string;
}

// API 응답용 타입 (날짜는 string으로 받음)
export interface ArticleResponse extends Omit<ArticleSummary, 'completedAt'> {
    completedAt: string;
}