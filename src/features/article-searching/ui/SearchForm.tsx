import { useSearchForm } from "../lib/useSearchForm";

export const SearchForm = () => {
    const { inputValue, handleSearch, handleInputChange } = useSearchForm();

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="flex gap-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="글을 검색해보세요..."
                    className="flex-1 px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-colors"
                />
                <button
                    type="submit"
                    className="px-4 py-2 font-semibold text-gray-900 dark:text-white hover:opacity-60 transition-opacity whitespace-nowrap"
                >
                    검색
                </button>
            </div>
        </form>
    );
};
