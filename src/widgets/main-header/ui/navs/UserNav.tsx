import { Link } from "react-router-dom";
import { useAuthStore } from "@/entities/user/lib";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/shared/ui/base/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/base/button";
import { ThemeMenu } from "./ThemeMenu";

export const UserNav = () => {
    const { signOut } = useAuthStore();

    return (
        <div className="flex gap-3 items-center">
            <Link
                to="/blog-create"
                className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hover:opacity-60 transition-opacity whitespace-nowrap"
            >
                블로그 생성
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="border-gray-200 dark:border-gray-800 hover:opacity-60">
                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <ThemeMenu />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={signOut} className="text-red-600 dark:text-red-400">
                        로그아웃
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
