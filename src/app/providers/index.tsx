import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "sonner";
import {ThemeProvider} from "@/shared/lib/theme";
import { useTheme } from "@/shared/lib/hooks/useTheme";
import React, { useEffect } from "react";
import { useAuthStore } from "@/entities/user/lib";
import { validateToken, refreshAccessToken } from "@/entities/auth/api/authApi";
import { HelmetProvider } from "react-helmet-async";

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
 * 앱 시작 시 토큰 유효성 검증 및 자동 갱신
 * 1. accessToken이 없으면 refreshToken으로 자동 갱신 시도
 * 2. accessToken이 있으면 유효성 검증
 * 3. 갱신/검증 실패 시 로그아웃 (필요시)
 */
const TokenValidator = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const initializeToken = async () => {
            const { accessToken, setAccessToken, signOut } = useAuthStore.getState();

            if (accessToken) {
                // accessToken이 있으면 유효성 검증
                try {
                    console.log("[TokenValidator] Validating existing access token...");
                    await validateToken();
                    console.log("[TokenValidator] Access token is valid");
                } catch (error: any) {
                    // 401 에러 → 토큰 무효
                    if (error?.status === 401 || error?.response?.status === 401) {
                        console.log("[TokenValidator] Access token validation failed: 401 Unauthorized");
                        signOut();
                        queryClient.invalidateQueries({
                            queryKey: ['user'],
                            exact: false,
                        });
                        queryClient.invalidateQueries({
                            queryKey: ['blog'],
                            exact: false,
                        });
                    }
                }
            } else {
                // accessToken이 없으면 refreshToken으로 갱신 시도
                try {
                    console.log("[TokenValidator] No access token. Attempting to refresh with refresh token...");
                    const response = await refreshAccessToken();
                    const newToken = response.accessToken;

                    console.log("[TokenValidator] Token refreshed successfully");
                    setAccessToken(newToken);
                } catch (error: any) {
                    // 갱신 실패 원인 파악
                    console.error("[TokenValidator] Token refresh failed:", {
                        status: error?.response?.status,
                        message: error?.response?.data?.detail || error?.message,
                        fullError: error,
                    });
                    // 갱신 실패 → 로그아웃 처리하지 않음 (공개 API는 계속 사용 가능)
                    // 인증이 필요한 API 호출 시 401 에러로 로그아웃 처리
                    console.log("[TokenValidator] Refresh token might be expired or missing. Will handle on first protected API call.");
                }
            }
        };

        initializeToken();
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