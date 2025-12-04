import { Logo, ModeToggle } from "@/shared/ui";
import { NavLink } from "./NavLink";
import { useAuth, useAuthStore, useFetchBlogInfo } from "@/entities/user/lib";
import { GuestNav, UserNav, AuthorNav } from "./navs";
import { useNavigate } from "react-router-dom";
import { Search, Menu } from "lucide-react";

interface MainHeaderProps {
    onToggleSidebar: () => void;
}

export const MainHeader = ({ onToggleSidebar }: MainHeaderProps) => {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const { blogId } = useAuthStore();

    // useFetchBlogInfo는 내부적으로 enabled 조건으로 관리되므로, useAuth의 isSignedIn이 변경되면 자동으로 반응함
    useFetchBlogInfo();

    const renderNav = () => {
        if (!isSignedIn) {
            return <GuestNav />;
        }

        if (!blogId) {
            return <UserNav />;
        }

        return <AuthorNav />;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="mx-auto flex items-center px-4 py-3">
                {/* 왼쪽: 토글 버튼 + 로고 */}
                <button
                    onClick={onToggleSidebar}
                    className="hidden lg:flex mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none transition-colors"
                >
                    <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <Logo />

                {/* 가운데: 내비게이션 */}
                <nav className="flex-1 flex justify-center">
                    <NavLink />
                </nav>

                {/* 오른쪽: 검색 + 버튼 + 모드 토글 */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/search")}
                        className="p-2 hover:bg-accent rounded-none transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    {renderNav()}
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}