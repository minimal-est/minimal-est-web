export interface PresignedUrlRequest {
    fileName: string;
    fileSize: number;
    mimeType: string;
}

export interface PresignedUrlResponse {
    presignedUrl: string;
    objectKey: string;
    expiresAt: string;
    fileName: string;
}