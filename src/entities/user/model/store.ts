import { parseJwt } from "@/utils/jwt";
import { create } from "zustand";
import type {AuthInfo, AuthState, JwtPayload} from "@/entities/user/model"

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
                    isSignedIn: true,
                });
            }
            return;
        }

        sessionStorage.removeItem(ACCESS_TOKEN);
        set({
            accessToken: null,
            authInfo: null,
            isSignedIn: false,
        });
    }

    // init
    const initToken = sessionStorage.getItem(ACCESS_TOKEN);
    const initAuthInfo = initToken ? extractAuthInfo(initToken) : null

    return {
        // init
        accessToken: initToken,
        authInfo: initAuthInfo,
        isSignedIn: !!initAuthInfo,

        // actions
        setAccessToken: (token: string) => {
            updateAuthState(token);
        },

        setAuthInfo: (authInfo: AuthInfo) => {
            set({ authInfo })
        },

        setIsSignedIn: (state: boolean) => {
            set({ isSignedIn: state })
        },

        signIn: (token: string) => {
            updateAuthState(token);
        },

        signOut: () => {
            updateAuthState(null);
        },
    }
});