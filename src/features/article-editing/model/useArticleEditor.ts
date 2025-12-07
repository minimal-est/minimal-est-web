import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { JSONContent } from "@tiptap/core";
import { completeArticle, createArticle, updateArticle, fetchSingleArticle } from "@/entities/article/api";
import { articleKeys } from "@/entities/article/lib";
import { useAuthStore } from "@/entities/user/lib";
import {
    VALIDATION_MESSAGES,
    ARTICLE_TITLE_MAX_LENGTH,
    ARTICLE_DESCRIPTION_MAX_LENGTH,
    ARTICLE_CONTENT_MIN_LENGTH,
    ARTICLE_CONTENT_MAX_LENGTH,
    TAG_MIN_LENGTH,
    TAG_MAX_LENGTH,
    TAG_REGEX,
} from "@/shared/constants";
import { toast } from "sonner";

interface UseArticleEditorProps {
    articleId?: string;
    isEditMode?: boolean;
}

export const useArticleEditor = ({ articleId: urlArticleId, isEditMode = false }: UseArticleEditorProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { blogId, penName } = useAuthStore();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState<JSONContent[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(!!urlArticleId);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [articleIdState, setArticleIdState] = useState(urlArticleId);
    const [articleStatus, setArticleStatus] = useState<string | null>(null);

    /**
     * 글의 상태에 따라 모드 결정
     * - PUBLISHED: 수정 모드 [수정완료]
     * - DRAFT: 작성 모드 [저장][발행]
     */
    const effectiveIsEditMode = articleStatus === "PUBLISHED";

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<"save" | "publish">("save");

    /**
     * 에러 상태 변화를 감시하여 일시적으로 유지 후 자동 초기화
     * 같은 에러가 반복되어도 toast가 나타나도록 함
     */
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [error]);

    /**
     * 새 글 생성 시 리다이렉트 시킵니다.
     * 만약 편집모드라면 리다이렉트할 필요가 없습니다.
     */
    useEffect(() => {
        // 이미 articleId가 URL에 있으면 새 글을 생성하지 않음
        if (urlArticleId || isEditMode || !blogId) return;

        const createAndRedirect = async () => {
            try {
                const result = await createArticle(blogId);
                setArticleIdState(result.articleId);
                setArticleStatus("DRAFT");
                navigate(`/write/${result.articleId}`, { replace: true });
            } catch (err) {
                setError("글 생성에 실패하였습니다.");
                console.error(err);
                setIsInitialLoading(false);
            }
        };

        createAndRedirect();
    }, [urlArticleId, blogId, isEditMode, navigate]);

    // 글을 불러와 반영합니다.
    useEffect(() => {
        if (!urlArticleId || !penName) return;

        const loadArticle = async () => {
            try {
                const article = await fetchSingleArticle({ penName, articleId: urlArticleId });
                setTitle(article.title);
                setDescription(article.description);
                setContent(article.content);
                setTags(article.tags || []);
                setArticleStatus(article.status);
            } catch (err) {
                setError("글을 불러올 수 없습니다.");
                console.error(err);
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadArticle();
    }, [urlArticleId, penName]);


    const getPlainText = (node: JSONContent[]): string => {
        let pureText = "";

        for (const child of node) {
            pureText += extractPlainText(child);
        }

        return pureText;
    }

    /**
     * ProseMirror에서 순수 텍스트만 추출하는 함수
     */
    const extractPlainText = (node: JSONContent) => {
        let result = "";

        if (node.type === "text" && typeof node.text === "string") {
            result += node.text;
        }

        if (Array.isArray(node.content)) {
            for (const child of node.content) {
                result += extractPlainText(child);
            }
        }

        return result;
    }

    const validateArticle = (): boolean => {
        const contentText = getPlainText(content);

        if (!title.trim()) {
            setError(VALIDATION_MESSAGES.TITLE_REQUIRED);
            return false;
        }

        if (title.length > ARTICLE_TITLE_MAX_LENGTH) {
            setError(VALIDATION_MESSAGES.TITLE_TOO_LONG);
            return false;
        }

        if (description.length > ARTICLE_DESCRIPTION_MAX_LENGTH) {
            setError(VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG);
            return false;
        }

        if (contentText.length === 0) {
            setError(VALIDATION_MESSAGES.CONTENT_REQUIRED);
            return false;
        }

        if (contentText.length < ARTICLE_CONTENT_MIN_LENGTH) {
            setError(VALIDATION_MESSAGES.CONTENT_TOO_SHORT);
            return false;
        }

        if (contentText.length > ARTICLE_CONTENT_MAX_LENGTH) {
            setError(VALIDATION_MESSAGES.CONTENT_TOO_LONG);
            return false;
        }

        // 태그 검증 (배열이 비어있으면 검증 통과)
        for (const tag of tags) {
            if (tag.length < TAG_MIN_LENGTH) {
                setError(VALIDATION_MESSAGES.TAG_TOO_SHORT);
                return false;
            }

            if (tag.length > TAG_MAX_LENGTH) {
                setError(VALIDATION_MESSAGES.TAG_TOO_LONG);
                return false;
            }

            if (!TAG_REGEX.test(tag)) {
                setError(VALIDATION_MESSAGES.TAG_INVALID_FORMAT);
                return false;
            }
        }

        // 검사 통과 시 에러 초기화
        setError(null);
        return true;
    };

    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if (!trimmed) return;

        if (trimmed.length < TAG_MIN_LENGTH) {
            toast.error(`태그는 ${TAG_MIN_LENGTH}자 이상이어야 합니다.`);
            return;
        }

        if (trimmed.length > TAG_MAX_LENGTH) {
            toast.error(`태그는 ${TAG_MAX_LENGTH}자 이하여야 합니다.`);
            return;
        }

        if (!TAG_REGEX.test(trimmed)) {
            toast.error('태그는 영문, 숫자, 한글만 사용 가능합니다.');
            return;
        }

        if (tags.includes(trimmed)) {
            toast.error('이미 추가된 태그입니다.');
            return;
        }

        setTags([...tags, trimmed]);
        setTagInput("");
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    /**
     * 글 저장 (모달 열기)
     * 유효성 검사 후 미리보기 모달을 띄웁니다.
     */
    const handleSave = (e: React.FormEvent) => {
        const currentArticleId = articleIdState || urlArticleId;

        // 필수 정보 확인
        if (!blogId || !currentArticleId) {
            setError("유효한 글 정보를 불러올 수 없습니다.");
            navigate("/");
            return;
        }

        e.preventDefault();

        // 글 내용 유효성 검사
        if (!validateArticle()) {
            return;
        }

        // 모달 열기
        setModalAction("save");
        setIsModalOpen(true);
    };

    /**
     * 모달에서 저장 확인 후 실제 API 호출
     */
    const performSave = async () => {
        const currentArticleId = articleIdState || urlArticleId;

        if (!blogId || !currentArticleId) {
            setError("유효한 글 정보를 불러올 수 없습니다.");
            return;
        }

        setIsLoading(true);

        try {
            // 글 저장
            console.log(getPlainText(content));
            await updateArticle({ blogId, articleId: currentArticleId, title, content, pureContent: getPlainText(content), description, tags });
            await queryClient.invalidateQueries({ queryKey: articleKeys.all });

            // 성공 처리
            setError(null);
            setSuccess("글이 저장되었습니다.");
            setIsModalOpen(false);

            // 수정 모드일 경우 상세페이지로 이동
            if (isEditMode && penName) {
                navigate(`/articles/${penName}/${currentArticleId}`);
            }
        } catch (apiError: unknown) {
            const errorMessage = (apiError as any)?.response?.data?.detail || "글 저장에 실패했습니다.";
            setError(errorMessage);
            setSuccess(null);
            console.error("Article save error:", apiError);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 글 발행 (모달 열기)
     * 유효성 검사 후 미리보기 모달을 띄웁니다.
     */
    const handlePublish = (e: React.FormEvent) => {
        const currentArticleId = articleIdState || urlArticleId;

        // 필수 정보 확인
        if (!blogId || !currentArticleId) {
            setError("유효한 글 정보를 불러올 수 없습니다.");
            navigate("/");
            return;
        }

        e.preventDefault();

        // 글 내용 유효성 검사
        if (!validateArticle()) {
            return;
        }

        // 모달 열기
        setModalAction("publish");
        setIsModalOpen(true);
    };

    /**
     * 모달에서 발행 확인 후 실제 API 호출
     */
    const performPublish = async () => {
        const currentArticleId = articleIdState || urlArticleId;

        if (!blogId || !currentArticleId) {
            setError("유효한 글 정보를 불러올 수 없습니다.");
            return;
        }

        setIsLoading(true);

        try {
            // 글 저장 후 발행
            await updateArticle({ blogId, articleId: currentArticleId, title, content, pureContent: getPlainText(content), description, tags });
            await completeArticle(blogId, currentArticleId);
            await queryClient.invalidateQueries({ queryKey: articleKeys.all });

            // 성공 처리
            setError(null);
            setSuccess("글이 발행되었습니다.");
            setIsModalOpen(false);
            navigate("/");
        } catch (apiError: unknown) {
            const errorMessage = (apiError as any)?.response?.data?.detail || "글 발행에 실패했습니다.";
            setError(errorMessage);
            setSuccess(null);
            console.error("Article publish error:", apiError);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 모달 미리보기에 표시할 ArticleSummary 생성
     */
    const previewArticle = {
        articleId: articleIdState || urlArticleId || "",
        slug: "",
        title,
        description,
        publishedAt: new Date(),
        author: {
            authorId: "",
            penName: penName || "",
            profileImageUrl: "", // 미리보기용 빈 이미지
        },
    };

    return {
        // 글 내용 상태
        title,
        setTitle,
        description,
        setDescription,
        content,
        setContent,
        tags,
        setTags,
        tagInput,
        setTagInput,

        // 로딩 상태
        isLoading,
        isInitialLoading,

        // 메시지 상태
        error,
        success,

        // 버튼 핸들러
        handleSave,
        handlePublish,
        handleAddTag,
        handleRemoveTag,

        // 모달 상태
        isModalOpen,
        setIsModalOpen,
        modalAction,
        performSave,
        performPublish,
        previewArticle,

        // 기타
        blogId,
        articleId: articleIdState || urlArticleId,
        isEditMode: effectiveIsEditMode,
    };
};
