import {Moon, Sun} from "lucide-react";
import {useTheme} from "@/shared/lib/hooks/useTheme.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/ui/base/dropdown-menu.tsx";
import {Button} from "@/shared/ui/base/button.tsx";

export const ModeToggle = () => {
    const {setTheme} = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun
                        className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"/>
                    <Moon
                        className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"/>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setTheme("light")}>
                    라이트 모드
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme("dark")}>
                    다크 모드
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme("system")}>
                    시스템
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}