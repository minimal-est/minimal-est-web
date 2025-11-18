import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ErrorResponse } from "@/shared/api";
import { API_BASE_URL, API_REQUEST_TIMEOUT } from '@/shared/constants';

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

export const setupInterceptors = (store: AuthStore) => {
    client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
        const { accessToken } = store.getState();

        // Access Token이 존재할 경우, Authorization 헤더 포함 후 요청 진행
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
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

    client.interceptors.response.use(
        (response: AxiosResponse) => (response),
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // 네트워크 오류 및 해석할 수 없음
            const errorResponse: ErrorResponse = toErrorResponse(error);
            if (errorResponse.status === 0) return Promise.reject(errorResponse);

            // Access Token 만료 시
            if (errorResponse.status === 401 && !originalRequest._retry) {
                if (isTokenRefreshing) {
                    // 이미 토큰 갱신 중이라면 대기
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

                originalRequest._retry = true;
                isTokenRefreshing = true;

                try {
                    const { setAccessToken } = store;

                    // 토큰 갱신 요청
                    const refreshResponse = await axiosRefreshClient.post<{ accessToken: string }>(
                        "/auth/token/refresh"
                    );
                    const newToken = refreshResponse.data.accessToken;

                    setAccessToken(newToken);

                    // 대기 중인 모든 요청들에게 새 토큰 전달
                    notifyTokenRefreshSuccess(newToken);
                    return client(originalRequest);
                } catch (refreshError) {
                    const { signOut: logout } = store;
                    logout();
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

