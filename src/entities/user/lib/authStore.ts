import { parseJwt } from "@/utils/jwt";
import { create } from "zustand";
import type {AuthInfo, AuthState, JwtPayload} from "@/entities/user/model"

export const ACCESS_TOKEN = "accessToken";

export const useAuthStore = create<AuthState>((set) => {

    const extractAuthInfo = (token: string): AuthInfo | null => {
        const payload = parseJwt<JwtPayload>(token);
        return payload ? { userId: payload.sub } : null;
    }

    const updateAuthState = (token: string | null): void => {
        if (token) {
            const authInfo = extractAuthInfo(token);
            if (authInfo) {
                localStorage.setItem(ACCESS_TOKEN, token);
                set({
                    accessToken: token,
                    authInfo: authInfo,
                    isSignedIn: true,
                    blogId: null,
                    penName: null,
                    profileImageUrl: null,
                });
            }
            return;
        }

        localStorage.removeItem(ACCESS_TOKEN);
        set({
            accessToken: null,
            authInfo: null,
            isSignedIn: false,
            blogId: null,
            penName: null,
            profileImageUrl: null,
        });
    }

    // localStorage에서만 토큰 확인 (단일 저장소)
    const initToken = localStorage.getItem(ACCESS_TOKEN);
    const initAuthInfo = initToken ? extractAuthInfo(initToken) : null

    return {
        accessToken: initToken,
        authInfo: initAuthInfo,
        isSignedIn: !!initAuthInfo,
        blogId: null,
        penName: null,
        profileImageUrl: null,

        // actions
        setAccessToken: (token: string) => {
            updateAuthState(token);
        },

        signIn: (token: string) => {
            updateAuthState(token);
        },

        signOut: () => {
            updateAuthState(null);
        },

        setBlogInfo: (blogId: string, penName: string, profileImageUrl: string) => {
            set({ blogId, penName, profileImageUrl });
        },

        clearBlogInfo: () => {
            set({ blogId: null, penName: null, profileImageUrl: null });
        }
    }
});