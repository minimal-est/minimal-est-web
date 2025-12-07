import { Link } from "react-router-dom";
import { useAuthStore, useLogout } from "@/entities/user/lib";
import { ProfileAvatar } from "@/entities/blog/ui";
import { useState, useRef, useEffect } from "react";

export const AuthorNav = () => {
    const { penName, profileImageUrl } = useAuthStore();
    const { mutate: logout } = useLogout();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <div className="flex gap-2 items-center">
            <Link
                to="/articles/create"
                className="px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-none hover:opacity-90 transition-opacity font-medium text-xs sm:text-sm whitespace-nowrap"
            >
                글쓰기
            </Link>
            <Link
                to="/articles/manage"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
            >
                내 글
            </Link>
            <div ref={dropdownRef} className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 hover:opacity-60 transition-opacity"
                >
                    <ProfileAvatar
                        penName={penName || ""}
                        profileImageUrl={profileImageUrl}
                        size="sm"
                    />
                </button>

                {/* 드롭다운 메뉴 */}
                {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none shadow-md z-50">
                        <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                        >
                            로그아웃
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
