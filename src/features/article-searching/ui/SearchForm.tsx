import { useSearchForm } from "../lib/useSearchForm";

export const SearchForm = () => {
    const { inputValue, handleSearch, handleInputChange } = useSearchForm();

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="글 제목이나 내용으로 검색..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                >
                    검색
                </button>
            </div>
        </form>
    );
};
