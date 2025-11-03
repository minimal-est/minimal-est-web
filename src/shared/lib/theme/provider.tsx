import React, {useEffect, useState} from "react";
import type {Theme} from "@/shared/theme/ThemeTypes.ts";
import { ThemeProviderContext } from "./context";

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme
    storageKey?: string
}

export const Provider = ({ children, defaultTheme, storageKey="ui-theme", ...props}: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    );

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches ? "dark" : "light"

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            console.log(theme);
            setThemeState(theme);
        }
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

