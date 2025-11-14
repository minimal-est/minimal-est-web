import { client } from "@/shared/api";

export interface CreateBlogRequest {
    penName: string;
}

export interface CreateBlogResponse {
    blogId: string;
}

export interface FindBlogSelfResponse {
    blogId: string;
    userId: string;
    penName: string;
}

/**
 * 블로그 생성
 * @param penName - 필명
 * @returns 생성된 블로그의 ID
 */
export const createBlog = async (createBlogRequest: CreateBlogRequest): Promise<CreateBlogResponse> => {
    const response = await client.post<CreateBlogResponse>(
        "/blogs",
        {
            penName: createBlogRequest.penName,
        }
    );

    return response.data;
};

/**
 * 현재 로그인한 사용자의 블로그 정보 조회
 * @returns 사용자의 블로그 정보
 */
export const findBlogSelf = async (): Promise<FindBlogSelfResponse> => {
    const response = await client.get<FindBlogSelfResponse>("/blogs/self");
    return response.data;
};

/**
 * 특정 필명의 블로그 정보 조회
 * @param penName - 필명
 * @returns 블로그 정보
 */
export const findBlogByPenName = async (penName: string): Promise<{ blogId: string; penName: string }> => {
    const response = await client.get(`/blogs/${penName}`);
    return response.data;
};
