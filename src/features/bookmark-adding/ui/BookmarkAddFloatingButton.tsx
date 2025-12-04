import { Bookmark } from 'lucide-react';

interface BookmarkAddFloatingButtonProps {
    isLoading?: boolean;
    onClick?: () => void;
}

export const BookmarkAddFloatingButton = ({
    isLoading = false,
    onClick,
}: BookmarkAddFloatingButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="fixed bottom-8 right-8 flex items-center justify-center w-14 h-14 rounded-none bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 disabled:bg-gray-400 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 z-40"
            title="북마크 추가"
        >
            <Bookmark size={24} />
        </button>
    );
};
