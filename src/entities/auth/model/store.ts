import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "./types";

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user }),
            setAccessToken: (token) => set({ accessToken: token }),
            setIsLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            logout: () => set({ user: null, accessToken: null, error: null }),
            reset: () => set({
                user: null,
                accessToken: null,
                isLoading: false,
                error: null,
            }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
            }),
        }
    )
);
