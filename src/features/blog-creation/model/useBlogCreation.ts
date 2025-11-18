import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "@/entities/blog/api";
import { useAuthStore } from "@/entities/user/lib";
import {
    PEN_NAME_MIN_LENGTH,
    PEN_NAME_MAX_LENGTH,
    VALIDATION_MESSAGES
} from "@/shared/constants";

export const useBlogCreation = () => {
    const navigate = useNavigate();
    const { setBlogInfo } = useAuthStore();

    const [penName, setPenName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * 필명 유효성 검사
     * - 필수 입력
     * - 최소 2자 이상
     * - 최대 50자 이하
     */
    const validatePenName = (): boolean => {
        if (!penName.trim()) {
            setError(VALIDATION_MESSAGES.REQUIRED_FIELD);
            return false;
        }

        if (penName.length < PEN_NAME_MIN_LENGTH) {
            setError(VALIDATION_MESSAGES.PEN_NAME_TOO_SHORT);
            return false;
        }

        if (penName.length > PEN_NAME_MAX_LENGTH) {
            setError(VALIDATION_MESSAGES.PEN_NAME_TOO_LONG);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePenName()) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await createBlog({ penName });
            setBlogInfo(response.blogId, penName);
            navigate("/");
        } catch (err: any) {
            const errorMessage = err?.detail || VALIDATION_MESSAGES.REQUIRED_FIELD;
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        penName,
        setPenName,
        isLoading,
        error,
        handleSubmit,
    };
};
