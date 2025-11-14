import { create } from "zustand";
import type { UserState, BlogInfo } from "./types";

const BLOG_INFO_KEY = "blogInfo";

const initBlogInfo = (): BlogInfo | null => {
    try {
        const stored = localStorage.getItem(BLOG_INFO_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

export const useUserStore = create<UserState>((set, get) => {
    return {
        blogInfo: initBlogInfo(),

        setBlogInfo: (blogInfo: BlogInfo) => {
            set({ blogInfo });
            // localStorage에도 저장
            localStorage.setItem(BLOG_INFO_KEY, JSON.stringify(blogInfo));
        },

        clearBlogInfo: () => {
            set({ blogInfo: null });
            localStorage.removeItem(BLOG_INFO_KEY);
        },

        hasBlog: () => {
            return get().blogInfo !== null;
        },
    };
});
