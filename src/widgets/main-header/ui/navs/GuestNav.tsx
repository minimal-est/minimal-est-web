import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent
} from "@/shared/ui/base/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/base/button";
import { ThemeMenu } from "./ThemeMenu";

export const GuestNav = () => {
    return (
        <div className="flex gap-3 items-center">
            <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hover:opacity-60 transition-opacity"
            >
                로그인
            </Link>
            <Link
                to="/signup"
                className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hover:opacity-60 transition-opacity"
            >
                회원가입
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
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
