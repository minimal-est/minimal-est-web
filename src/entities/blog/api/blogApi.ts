import { client } from "@/shared/api"
import type { CreateBlogRequest, CreateBlogResponse, BlogProfile } from "../model";
import type { BlogDetails } from "../model/types";

export const createBlog = async ({ penName }: CreateBlogRequest): Promise<CreateBlogResponse> => {
    const response = await client.post(`/blogs`, {
        penName
    });

    return response.data;
}

/**
 * 블로그 프로필 조회 (프로필 이미지 URL만)
 * @param blogId - 블로그 ID
 */
export const getBlogProfile = async (blogId: string): Promise<BlogProfile> => {
    const response = await client.get(`/blogs/${blogId}/profile`);
    return response.data;
}

export const getBlogDetails = async(penName: string): Promise<BlogDetails> => {
    const response = await client.get(`/blogs/${penName}`);
    return response.data;
}