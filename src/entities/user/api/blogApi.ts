import { client } from "@/shared/api";

export interface AuthorInfoResponse {
    authorId: string;
    penName: string;
    profileImageUrl: string;
}

export interface BlogInfoResponse {
    blogId: string;
    author: AuthorInfoResponse;
}

export const blogApi = {
    fetchBlogSelf: async () => {
        const response = await client.get<BlogInfoResponse>('/blogs/self')
        return response.data;
    },

    fetchBlogByPenName: async (penName: string) => {
        const response = await client.get<BlogInfoResponse>(`/blogs/${penName}`)
        return response.data;
    },
}