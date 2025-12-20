import { parseJwt } from "@/shared/lib/utils/jwt";
import { create } from "zustand";
import type {AuthInfo, AuthState, JwtPayload} from "@/entities/user/model"

/**
 * localStorage에 저장되는 accessToken의 키
 */
export const ACCESS_TOKEN = "accessToken";

/**
 * JWT 기반 인증 상태 관리 스토어
 *
 * 인증 토큰 전략:
 * - accessToken: localStorage에 저장 (클라이언트 접근 가능, 만료 시간 짧음)
 * - refreshToken: httpOnly 쿠키에 저장 (클라이언트 접근 불가, 만료 시간 김)
 *
 * 역할 분리:
 * - signIn: 새로운 로그인 시 사용 (블로그 정보 초기화)
 * - setAccessToken: 토큰 갱신 시 사용 (블로그 정보 유지)
 * - signOut: 로그아웃 시 사용 (모든 정보 초기화)
 */
export const useAuthStore = create<AuthState>((set) => {

    /**
     * JWT 토큰에서 인증 정보(userId) 추출
     */
    const extractAuthInfo = (token: string): AuthInfo | null => {
        const payload = parseJwt<JwtPayload>(token);
        return payload ? { userId: payload.sub } : null;
    }

    /**
     * 로그인/로그아웃 시 인증 상태 업데이트 (블로그 정보 초기화)
     * signIn, signOut에서 사용
     */
    const updateAuthState = (token: string | null): void => {
        if (token) {
            const authInfo = extractAuthInfo(token);
            if (authInfo) {
                localStorage.setItem(ACCESS_TOKEN, token);
                set({
                    accessToken: token,
                    authInfo: authInfo,
                    isSignedIn: true,
                    // 새 로그인이므로 블로그 정보 초기화
                    blogId: null,
                    penName: null,
                    profileImageUrl: null,
                });
            }
            return;
        }

        // 로그아웃
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

    // 앱 초기화: localStorage에서 토큰 복원
    const initToken = localStorage.getItem(ACCESS_TOKEN);
    const initAuthInfo = initToken ? extractAuthInfo(initToken) : null

    return {
        // === State ===
        accessToken: initToken,
        authInfo: initAuthInfo,
        isSignedIn: !!initAuthInfo,
        blogId: null,
        penName: null,
        profileImageUrl: null,

        // === Actions ===

        /**
         * 토큰 갱신 (Refresh Token 사용)
         * Interceptor에서 401 에러 시 자동으로 호출됨
         *
         * 블로그 정보를 유지하는 이유:
         * - 글 작성 중 토큰이 만료되어도 작성 내용이 날아가지 않도록
         * - 사용자는 계속 같은 계정으로 작업 중이므로 블로그 정보 변경 불필요
         */
        setAccessToken: (token: string) => {
            const authInfo = extractAuthInfo(token);
            if (authInfo) {
                localStorage.setItem(ACCESS_TOKEN, token);
                set((state) => ({
                    accessToken: token,
                    authInfo: authInfo,
                    isSignedIn: true,
                    // 기존 블로그 정보 유지 (중요!)
                    blogId: state.blogId,
                    penName: state.penName,
                    profileImageUrl: state.profileImageUrl,
                }));
            }
        },

        /**
         * 새로운 로그인
         * LoginPage에서 사용
         *
         * 블로그 정보를 초기화하는 이유:
         * - 다른 계정으로 로그인할 수 있으므로 이전 블로그 정보 제거 필요
         */
        signIn: (token: string) => {
            updateAuthState(token);
        },

        /**
         * 로그아웃
         * 모든 인증 정보 및 블로그 정보 초기화
         */
        signOut: () => {
            updateAuthState(null);
        },

        /**
         * 블로그 정보 설정
         * TokenValidator 또는 useFetchBlogInfo에서 호출
         */
        setBlogInfo: (blogId: string, penName: string, profileImageUrl: string) => {
            set({ blogId, penName, profileImageUrl });
        },

        /**
         * 블로그 정보 초기화
         * 블로그가 없는 경우 (404) 호출
         */
        clearBlogInfo: () => {
            set({ blogId: null, penName: null, profileImageUrl: null });
        }
    }
});