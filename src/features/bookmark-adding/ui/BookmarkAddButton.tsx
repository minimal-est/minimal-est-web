import { Bookmark } from 'lucide-react';

interface BookmarkAddButtonProps {
    isLoading?: boolean;
    onClick?: () => void;
}

export const BookmarkAddButton = ({
    isLoading = false,
    onClick,
}: BookmarkAddButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-none bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 disabled:bg-gray-400 text-white transition-colors font-medium text-sm"
            title="북마크 추가"
        >
            <Bookmark size={16} />
            {isLoading ? '추가 중...' : '북마크'}
        </button>
    );
};
