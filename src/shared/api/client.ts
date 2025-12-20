import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ErrorResponse } from "@/shared/api";
import { API_BASE_URL, API_REQUEST_TIMEOUT } from '@/shared/constants';
import type { QueryClient } from '@tanstack/react-query';

export interface AuthStore {
    getState: () => { accessToken: string | null };
    setAccessToken: (token: string) => void;
    signOut: () => void;
}

export const client = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: API_REQUEST_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

const axiosRefreshClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: API_REQUEST_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        "X-Refresh-Request": true,
    }
})

/**
 * 토큰 갱신 상태 및 구독자 관리
 *
 * 동시에 여러 요청이 401 에러를 받으면:
 * 1. 첫 번째 요청만 토큰 갱신 시작
 * 2. 나머지 요청들은 구독자로 등록되어 대기
 * 3. 갱신 완료 후 모든 구독자에게 새 토큰 전달
 * 4. 구독자들이 대기 중인 요청 재시도
 */
let isTokenRefreshing = false;
let tokenRefreshSubscribers: ((token: string) => void)[] = [];
let tokenRefreshErrorSubscribers: ((error: any) => void)[] = [];

/**
 * 토큰 갱신 완료를 모든 구독자에게 알림
 */
const notifyTokenRefreshSuccess = (newToken: string) => {
    tokenRefreshSubscribers.forEach((callback) => callback(newToken));
    tokenRefreshSubscribers = [];
    tokenRefreshErrorSubscribers = [];
}

/**
 * 토큰 갱신 실패를 모든 구독자에게 알림
 */
const notifyTokenRefreshFailure = (error: any) => {
    tokenRefreshErrorSubscribers.forEach((callback) => callback(error));
    tokenRefreshSubscribers = [];
    tokenRefreshErrorSubscribers = [];
}

/**
 * 토큰 갱신 구독자 등록
 * 토큰 갱신 완료 또는 실패 시 콜백이 호출됨
 */
const registerTokenRefreshSubscriber = (
    onSuccess: (token: string) => void,
    onFailure: (error: any) => void
) => {
    tokenRefreshSubscribers.push(onSuccess);
    tokenRefreshErrorSubscribers.push(onFailure);
}

/**
 * Axios Interceptor 설정
 *
 * 요청 인터셉터:
 * - 모든 요청에 자동으로 Authorization 헤더 추가
 *
 * 응답 인터셉터:
 * - 401 에러 시 자동 토큰 갱신 및 재시도
 * - 동시 다발적 401 에러 처리 (구독자 패턴)
 */
export const setupInterceptors = (store: AuthStore, queryClientInstance?: QueryClient) => {
    /**
     * 요청 인터셉터
     * 모든 API 요청에 accessToken을 Authorization 헤더로 자동 추가
     * 서버는 이 토큰의 서명을 검증하여 위조 여부 판단
     */
    client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const { accessToken } = store.getState();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    })

    const toErrorResponse = (err: AxiosError): ErrorResponse => {

        if (!err.response) {
            const networkErrorResponse: ErrorResponse = {
                status: 0,
                title: "네트워크 오류",
                detail: "네트워크 오류가 발생했습니다. 문제가 지속되면 관리자에게 문의해주세요.",
                properties: null,
            }

            return networkErrorResponse;
        }

        return err.response.data as ErrorResponse;
    }

    /**
     * 응답 인터셉터
     * 401 Unauthorized 에러 발생 시 자동으로 토큰 갱신 및 재시도
     *
     * JWT 인증 플로우:
     * 1. API 요청 → 401 에러 (accessToken 만료 or 위조)
     * 2. refreshToken으로 새 accessToken 발급
     * 3. 새 토큰으로 원래 요청 재시도
     * 4. refreshToken도 만료 시 로그아웃
     *
     * 동시 401 에러 처리 (구독자 패턴):
     * - 여러 요청이 동시에 401을 받으면, 첫 요청만 토큰 갱신
     * - 나머지 요청은 구독자로 등록하여 갱신 완료 대기
     * - 갱신 성공 시 모든 대기 중인 요청에 새 토큰 전달 후 재시도
     */
    client.interceptors.response.use(
        (response: AxiosResponse) => (response),
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            const errorResponse: ErrorResponse = toErrorResponse(error);

            // 네트워크 오류 (서버 응답 없음)
            if (errorResponse.status === 0) return Promise.reject(errorResponse);

            // 401 Unauthorized: accessToken 만료 또는 위조
            if (errorResponse.status === 401 && !originalRequest._retry) {
                // 이미 토큰 갱신 중인 경우
                if (isTokenRefreshing) {
                    // 구독자로 등록하여 갱신 완료 대기
                    return new Promise((resolve, reject) => {
                        const onSuccess = (newToken: string) => {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            resolve(client(originalRequest));
                        };
                        const onFailure = (error: any) => {
                            reject(error);
                        }
                        registerTokenRefreshSubscriber(onSuccess, onFailure);
                    });
                }

                // 첫 번째 401 에러 → 토큰 갱신 시작
                originalRequest._retry = true;
                isTokenRefreshing = true;

                try {
                    const { setAccessToken } = store;

                    console.log('[Auth] Access token expired. Refreshing token...');
                    const refreshResponse = await axiosRefreshClient.post<{ accessToken: string }>(
                        "/auth/token/refresh"
                    );
                    const newToken = refreshResponse.data.accessToken;

                    console.log('[Auth] Token refreshed successfully');
                    setAccessToken(newToken);

                    // 대기 중인 모든 구독자에게 새 토큰 전달
                    notifyTokenRefreshSuccess(newToken);

                    // 원래 요청 재시도
                    return client(originalRequest);
                } catch (refreshError) {
                    console.error('[Auth] Token refresh failed. Logging out...', refreshError);

                    const { signOut: logout } = store;
                    logout();

                    // 사용자 관련 쿼리만 무효화 (공개 API는 계속 실행)
                    if (queryClientInstance) {
                        queryClientInstance.invalidateQueries({
                            queryKey: ['user'],
                            exact: false,
                        });
                        queryClientInstance.invalidateQueries({
                            queryKey: ['blog'],
                            exact: false,
                        });
                    }

                    // 대기 중인 모든 구독자에게 실패 알림
                    notifyTokenRefreshFailure(refreshError);

                    return Promise.reject(toErrorResponse(refreshError as AxiosError));
                } finally {
                    isTokenRefreshing = false;
                }
            }

            // 일반적인 에러 응답 반환
            return Promise.reject(errorResponse);
        }
    )
}

