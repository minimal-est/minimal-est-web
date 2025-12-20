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

/**
 * 블로그 정보 업데이트 (About)
 * @param penName - 필명
 * @param about - 블로그 소개
 */
export const updateBlogAbout = async (penName: string, about: string): Promise<void> => {
    await client.patch(`/blogs/${penName}/about`, { about });
}

/**
 * 블로그 프로필 이미지 업로드
 * @param blogId - 블로그 ID
 * @param file - 이미지 파일
 */
export const updateBlogProfileImage = async (blogId: string, file: File): Promise<{ profileImageUrl: string }> => {
    // 1. presigned URL 획득
    const presignedData = await client.post('/files/presigned', {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
    });

    const { presignedUrl, objectKey } = presignedData.data;

    // 2. S3에 파일 업로드
    const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    });

    if (!uploadResponse.ok) {
        // ErrorResponse 형식에 맞게 에러 생성
        const error: any = new Error('파일 업로드에 실패했습니다.');
        error.status = uploadResponse.status;
        error.title = 'S3 Upload Failed';
        error.detail = `S3 업로드 실패: ${uploadResponse.statusText}`;
        throw error;
    }

    // 3. S3 URL 생성
    const S3_URL = import.meta.env.VITE_S3_URL;
    const profileImageUrl = `${S3_URL}/${objectKey}`;

    // 4. 프로필 이미지 URL 저장
    await client.put(`/blogs/${blogId}/profile/image`, {
        profileImageUrl,
    });

    return { profileImageUrl };
}