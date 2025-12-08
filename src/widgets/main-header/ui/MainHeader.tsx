import { Logo } from "@/shared/ui";
import { NavLink } from "./NavLink";
import { useAuth, useAuthStore, useFetchBlogInfo } from "@/entities/user/lib";
import { GuestNav, UserNav, AuthorNav } from "./navs";
import { useNavigate } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { Spinner } from "@/shared/ui/base";

interface MainHeaderProps {
    onToggleSidebar: () => void;
}

export const MainHeader = ({ onToggleSidebar }: MainHeaderProps) => {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const { blogId } = useAuthStore();
    const { isLoading: isBlogLoading } = useFetchBlogInfo();

    const renderNav = () => {
        if (!isSignedIn) {
            return <GuestNav />;
        }

        // 로그인했지만 블로그 정보를 아직 받지 못한 경우 로딩 표시
        if (isBlogLoading || (isSignedIn && !blogId)) {
            return (
                <div className="flex items-center gap-2">
                    <Spinner/>
                </div>
            );
        }

        // 블로그가 없는 경우
        if (!blogId) {
            return <UserNav />;
        }

        // 블로그가 있는 경우
        return <AuthorNav />;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="mx-auto flex items-center px-4 py-2 lg:py-4 lg:px-8">
                {/* 왼쪽: 토글 버튼 + 로고 */}
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden mr-3 p-1 hover:opacity-60 transition-opacity"
                >
                    <Menu className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
                <Logo />

                {/* 가운데: 내비게이션 */}
                <nav className="flex-1 flex justify-center">
                    <NavLink />
                </nav>

                {/* 오른쪽: 검색 + 버튼 */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate("/search")}
                        className="p-1 hover:opacity-60 transition-opacity"
                    >
                        <Search className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>
                    {renderNav()}
                </div>
            </div>
        </header>
    );
}