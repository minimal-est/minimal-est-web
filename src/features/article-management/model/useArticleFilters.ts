import { useEffect, useState } from "react";
import { useMyArticles, useDeleteArticle } from "@/entities/article/lib";
import type { ArticleStatusFilter } from "@/entities/article/model/types";

export const useArticleFilters = (blogId: string) => {
    const [status, setStatus] = useState<ArticleStatusFilter>("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");

    const { data: articlesData, isLoading, error } = useMyArticles(
        blogId,
        status,
        search,
        page,
        10
    );
    const { mutate: deleteArticleMutate, isPending: isDeleting } = useDeleteArticle();

    useEffect(() => {
        setPage(0); // 필터 변경 시 첫 페이지로
    }, [status, search]);

    const handleSearch = () => {
        setSearch(searchInput);
    };

    const handleDelete = (articleId: string, callbacks?: { onSuccess?: () => void; onError?: () => void }) => {
        if (confirm("이 글을 삭제하시겠습니까?")) {
            deleteArticleMutate(
                { blogId, articleId },
                {
                    onSuccess: () => {
                        callbacks?.onSuccess?.();
                    },
                    onError: () => {
                        callbacks?.onError?.();
                    },
                }
            );
        }
    };

    return {
        status,
        setStatus,
        search,
        searchInput,
        setSearchInput,
        handleSearch,
        page,
        setPage,
        articlesData,
        isLoading,
        error,
        handleDelete,
        isDeleting,
    };
};
