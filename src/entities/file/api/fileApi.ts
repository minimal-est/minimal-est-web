import { client } from "@/shared/api";
import type { PresignedUrlRequest, PresignedUrlResponse } from "../model/types";

export const getPresignedUrl = async(request: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
    const response = await client.post<PresignedUrlResponse>(
        "files/presigned",
        request
    );
    return response.data;
}