import { client } from "@/shared/api"
import type { CreateBlogRequest, CreateBlogResponse } from "../model";

export const createBlog = async ({ penName }: CreateBlogRequest): Promise<CreateBlogResponse> => {
    const response = await client.post(`/blogs`, {
        penName
    });
    
    return response.data;
}