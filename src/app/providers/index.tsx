import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "sonner";
import {ThemeProvider} from "@/shared/lib/theme";
import React from "react";

const queryClient = new QueryClient();

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
            <QueryClientProvider client={queryClient}>
                <Toaster position="top-center" />
                { children }
            </QueryClientProvider>
        </ThemeProvider>
    )
}