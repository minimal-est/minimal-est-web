import { Link } from "react-router-dom";
import { useAuthStore } from "@/entities/user/lib";

export const UserNav = () => {
    const { signOut } = useAuthStore();

    return (
        <>
            <Link
                to="/blog-create"
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-none hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium text-sm"
            >
                블로그 생성
            </Link>
            <button
                onClick={signOut}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-none transition-colors font-medium text-sm"
            >
                로그아웃
            </button>
        </>
    );
};
