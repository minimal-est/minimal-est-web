import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "sonner";
import {ThemeProvider} from "@/shared/lib/theme";
import React from "react";
import { useFetchBlogInfo } from "@/entities/user/lib";

const queryClient = new QueryClient();

const BlogInfoProvider = ({ children }: { children: React.ReactNode }) => {
    useFetchBlogInfo();
    return children;
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
            <QueryClientProvider client={queryClient}>
                <Toaster position="top-center" />
                    <BlogInfoProvider>
                        { children }
                    </BlogInfoProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}