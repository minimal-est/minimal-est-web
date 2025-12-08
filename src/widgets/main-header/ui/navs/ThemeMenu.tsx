import { useTheme } from "@/shared/lib/hooks/useTheme";
import {
    DropdownMenuItem,
} from "@/shared/ui/base/dropdown-menu";
import { Moon, Sun, Monitor } from "lucide-react";

export const ThemeMenu = () => {
    const { setTheme } = useTheme();

    return (
        <>
            <DropdownMenuItem onSelect={() => setTheme("light")}>
                <Sun className="w-4 h-4 mr-2" />
                라이트 모드
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTheme("dark")}>
                <Moon className="w-4 h-4 mr-2" />
                다크 모드
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTheme("system")}>
                <Monitor className="w-4 h-4 mr-2" />
                시스템
            </DropdownMenuItem>
        </>
    );
};
