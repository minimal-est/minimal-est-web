import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useLogout } from "@/entities/user/lib";
import { ProfileAvatar } from "@/entities/blog/ui";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/shared/ui/base/dropdown-menu";
import { ThemeMenu } from "./ThemeMenu";

export const AuthorNav = () => {
    const navigate = useNavigate();
    const { penName, profileImageUrl } = useAuthStore();
    const { mutate: logout } = useLogout();

    return (
        <div className="flex gap-3 items-center">
            <Link
                to="/articles/create"
                className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hover:opacity-60 transition-opacity whitespace-nowrap"
            >
                글쓰기
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-60 transition-opacity">
                        <ProfileAvatar
                            penName={penName || ""}
                            profileImageUrl={profileImageUrl}
                            size="sm"
                        />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onSelect={() => navigate(`/b/${penName}`)} className="text-xs text-gray-900 dark:text-white font-semibold cursor-pointer">
                        {penName}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <ThemeMenu />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => logout()} className="text-sm text-red-600 dark:text-red-400">
                        로그아웃
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
