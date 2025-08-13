import type { JwtPayload } from "@/apis/types";
import { parseJwt } from "@/utils/jwt";
import { create } from "zustand";

interface AuthInfo {
    uuid: string;
}

interface AuthState {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    authInfo: AuthInfo | null;
    setAuthInfo: (authInfo: AuthInfo) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (state: boolean) => void;
    logout: () => void;
}

export const ACCESS_TOKEN = "accessToken";

export const useAuthStore = create<AuthState>((set) => {

    const extractAuthInfo = (token: string): AuthInfo | null => {
        const payload = parseJwt<JwtPayload>(token);
        return payload ? { uuid: payload.sub } : null;
    }

    const updateAuthState = (token: string | null): void => {
        if (token) {
            const authInfo = extractAuthInfo(token);
            if (authInfo) {
                sessionStorage.setItem(ACCESS_TOKEN, token);
                set({
                    accessToken: token,
                    authInfo: authInfo,
                    isLoggedIn: true,
                });
            }
            return;
        }
        
        sessionStorage.removeItem(ACCESS_TOKEN);
        set({
            accessToken: null,
            authInfo: null,
            isLoggedIn: false,
        });
    }

    // init
    const initToken = sessionStorage.getItem(ACCESS_TOKEN);
    const initAuthInfo = initToken ? extractAuthInfo(initToken) : null

    return {
        // init
        accessToken: initToken,
        authInfo: initAuthInfo,
        isLoggedIn: !!initAuthInfo,

        // actions
        setAccessToken: (token: string) => {
            updateAuthState(token);
        },

        setAuthInfo: (authInfo: AuthInfo) => {
            set({ authInfo })
        },

        setIsLoggedIn: (state: boolean) => {
            set({ isLoggedIn: state })
        },

        logout: () => {
            updateAuthState(null);
        },
    }
});