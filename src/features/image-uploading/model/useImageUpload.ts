import { getPresignedUrl } from "@/entities/file/api/fileApi";
import { useState } from "react"

export const useImaegUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async(file: File): Promise<string | null> => {
        setIsLoading(true);
        setError(null);

        try {
            if (!file.type.startsWith("image/")) {
                throw new Error("이미지 파일만 업로드 가능합니다.");
            }

            const maxSize = 20 * 1024 * 1024 // 20MB
            if (file.size > maxSize) {
                throw new Error("파일 크기는 20MB 이하여야 합니다.");
            }

            // presigned url 획득
            const presignedData = await getPresignedUrl({
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type
            });

            await fetch(presignedData.presignedUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                },
                body: file
            });

            const S3_URL = (import.meta as any).env.VITE_S3_URL;

            return `${S3_URL}/${presignedData.objectKey}`;
        } catch (err: any) {
            console.log(err);
            const errorMessage = err?.message || '이미지 업로드 실패';
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        uploadImage,
        isLoading,
        error,
    }
}