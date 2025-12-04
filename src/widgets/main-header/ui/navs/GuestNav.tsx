import { Link } from "react-router-dom";

export const GuestNav = () => {
    return (
        <>
            <Link
                to="/login"
                className="px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none transition-colors font-medium text-sm"
            >
                로그인
            </Link>
            <Link
                to="/signup"
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-none hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium text-sm"
            >
                회원가입
            </Link>
        </>
    );
};
