import { client } from "@/shared/api";

export interface BlogInfoResponse {
    blogId: string;
    userId: string;
    penName: string;
}

export const blogApi = {
    fetchBlogSelf: async () => {
        const response = await client.get<BlogInfoResponse>('/blogs/self')
        return response.data;
    },

    fetchBlogByPenName: async (penName: string) => {
        const response = await client.get<Omit<BlogInfoResponse, 'userId'>>(`/blogs/${penName}`)
        return response.data;
    },
}