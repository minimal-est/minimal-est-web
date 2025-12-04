import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "@/entities/blog/api";
import { useAuthStore } from "@/entities/user/lib";
import {
    PEN_NAME_MIN_LENGTH,
    PEN_NAME_MAX_LENGTH,
    PEN_NAME_REGEX,
    VALIDATION_MESSAGES
} from "@/shared/constants";

export const useBlogCreation = () => {
    const navigate = useNavigate();
    const { setBlogInfo } = useAuthStore();

    const [penName, setPenName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    /**
     * 필명 유효성 검사
     * - 필수 입력
     * - 최소 3자 이상
     * - 최대 20자 이하
     * - 한글, 영문, 숫자, 하이픈, 언더스코어 허용
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

        if (!PEN_NAME_REGEX.test(penName)) {
            setError(VALIDATION_MESSAGES.PEN_NAME_INVALID);
            return false;
        }

        return true;
    };

    /**
     * 실시간 유효성 검사 (입력할 때마다 실행)
     */
    const validatePenNameRealtime = (value: string): void => {
        if (!value.trim()) {
            setValidationError(null);
            return;
        }

        if (value.length < PEN_NAME_MIN_LENGTH) {
            setValidationError(VALIDATION_MESSAGES.PEN_NAME_TOO_SHORT);
            return;
        }

        if (value.length > PEN_NAME_MAX_LENGTH) {
            setValidationError(VALIDATION_MESSAGES.PEN_NAME_TOO_LONG);
            return;
        }

        if (!PEN_NAME_REGEX.test(value)) {
            setValidationError(VALIDATION_MESSAGES.PEN_NAME_INVALID);
            return;
        }

        setValidationError(null);
    };

    const handlePenNameChange = (value: string): void => {
        setPenName(value);
        validatePenNameRealtime(value);
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
            setBlogInfo(response.blogId, penName, "");
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
        handlePenNameChange,
        isLoading,
        error,
        validationError,
        handleSubmit,
    };
};
