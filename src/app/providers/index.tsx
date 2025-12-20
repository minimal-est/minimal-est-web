import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "sonner";
import {ThemeProvider} from "@/shared/lib/theme";
import { useTheme } from "@/shared/lib/hooks/useTheme";
import React, { useEffect } from "react";
import { useAuthStore } from "@/entities/user/lib";
import { refreshAccessToken } from "@/entities/auth/api/authApi";
import { HelmetProvider } from "react-helmet-async";
import { blogApi } from "@/entities/user/api/blogApi";
import { isTokenValid } from "@/shared/lib/utils/jwt";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5분
            gcTime: 1000 * 60 * 10, // 10분
        },
    },
});

/**
 * 테마에 맞춰 Toaster의 theme을 동적으로 설정합니다.
 */
const ThemedToaster = () => {
    const { theme } = useTheme();

    return <Toaster position="top-center" theme={theme as any} />;
};

/**
 * 앱 시작 시 인증 상태 초기화
 *
 * JWT 기반 인증 원칙:
 * 1. JWT의 exp(만료시간)는 클라이언트에서 체크 (서버에 확인 불필요)
 * 2. JWT 서명 검증은 서버가 자동으로 수행 (모든 API 요청마다)
 * 3. 위조된 토큰은 서버가 401로 자동 거부
 * 4. 클라이언트는 만료 여부만 확인하고, 필요한 데이터만 로드
 *
 * 플로우:
 * 1. accessToken 있음 + 만료 안됨 → 블로그 정보 로드
 * 2. accessToken 있음 + 만료됨 → refreshToken으로 갱신 시도
 * 3. accessToken 없음 → refreshToken으로 갱신 시도
 * 4. refreshToken 실패 → 첫 보호 API 요청 시 처리 (지연 처리)
 */
const TokenValidator = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const initializeAuth = async () => {
            const { accessToken, setAccessToken, setBlogInfo } = useAuthStore.getState();

            // 1. accessToken이 있고 유효한 경우
            if (accessToken && isTokenValid(accessToken)) {
                console.log("[Auth] Access token is valid. Loading blog info...");

                try {
                    const blogData = await blogApi.fetchBlogSelf();
                    setBlogInfo(blogData.blogId, blogData.author.penName, blogData.author.profileImageUrl);
                    console.log("[Auth] Blog info loaded successfully");
                } catch (blogError) {
                    console.warn("[Auth] Failed to load blog info:", blogError);
                    // 블로그 정보 로드 실패는 치명적이지 않음 (useFetchBlogInfo에서 재시도)
                }
                return;
            }

            // 2. accessToken이 없거나 만료된 경우 → refreshToken으로 갱신 시도
            console.log("[Auth] Access token missing or expired. Attempting refresh...");

            try {
                const response = await refreshAccessToken();
                const newToken = response.accessToken;

                console.log("[Auth] Token refreshed successfully");
                setAccessToken(newToken);

                // 토큰 갱신 후 블로그 정보 로드
                try {
                    const blogData = await blogApi.fetchBlogSelf();
                    setBlogInfo(blogData.blogId, blogData.author.penName, blogData.author.profileImageUrl);
                    console.log("[Auth] Blog info loaded after token refresh");
                } catch (blogError) {
                    console.warn("[Auth] Failed to load blog info after refresh:", blogError);
                }
            } catch (error: any) {
                // refreshToken 실패 → 로그인 필요
                console.warn("[Auth] Token refresh failed. User will need to login on first protected action.");
                // 여기서 로그아웃하지 않음 (첫 보호 API 요청 시 Interceptor가 처리)
            }
        };

        initializeAuth();
    }, []);

    return children;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <HelmetProvider>
            <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                <QueryClientProvider client={queryClient}>
                    <ThemedToaster />
                    <TokenValidator>
                        {children}
                    </TokenValidator>
                </QueryClientProvider>
            </ThemeProvider>
        </HelmetProvider>
    );
};