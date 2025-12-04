import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useSearchForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentQuery = searchParams.get("q") || "";
    const [inputValue, setInputValue] = useState(currentQuery);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedQuery = inputValue.trim();

        if (!trimmedQuery) {
            return;
        }

        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}&page=0`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return {
        inputValue,
        currentQuery,
        handleSearch,
        handleInputChange,
    };
};
