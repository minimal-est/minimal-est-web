import { Link } from "react-router-dom";
import {Logo, ModeToggle} from "@/shared/ui";
import {NavLink} from "./NavLink";
import { useAuthStore } from "@/entities/user/lib";

export const MainHeader = () => {
    const { isSignedIn, penName, signOut } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex items-center justify-between px-4 py-3">
                {/* 왼쪽: 로고 */}
                <Logo />

                {/* 가운데: 내비게이션 */}
                <nav>
                    <NavLink />
                </nav>

                {/* 오른쪽: 버튼 + 모드 토글 */}
                <div className="flex items-center gap-3">
                    {isSignedIn ? (
                        <>
                            <Link
                                to="/articles/create"
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium text-sm"
                            >
                                글쓰기
                            </Link>
                            <Link
                                to="/articles/manage"
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
                            >
                                내 글
                            </Link>
                            <div className="flex items-center gap-2 pl-3 border-l border-gray-300 dark:border-gray-600">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {penName}
                                </span>
                                <button
                                    onClick={signOut}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    로그아웃
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium text-sm"
                            >
                                로그인
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium text-sm"
                            >
                                회원가입
                            </Link>
                        </>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}