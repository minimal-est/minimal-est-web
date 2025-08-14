import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ErrorResponse } from './types';
import { useAuthStore } from '@/stores/authStore';

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    timeout: 10000, // 10s
    headers: {
        "Content-Type": "application/json",
    },
});

const axiosRefreshClient = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    timeout: 10000, // 10s
    headers: {
        "Content-Type": "application/json",
        "X-Refresh-Request": true,
    }
})

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
let refreshRejectSubscribers: ((err: any) => void)[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
    refreshRejectSubscribers = [];
}

const onRefreshedFailed = (err: any) => {
    refreshRejectSubscribers.forEach((cb) => cb(err));
    refreshSubscribers = [];
    refreshRejectSubscribers = [];
}

const addRefreshSubscriber = (cb: (token: string) => void, rejectCb: (err: any) => void) => {
    refreshSubscribers.push(cb);
    refreshRejectSubscribers.push(rejectCb);
}

axiosClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

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

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => (response),
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        
        // 네트워크 오류 및 해석할 수 없음
        const errorResponse: ErrorResponse = toErrorResponse(error);
        if (errorResponse.status === 0) return Promise.reject(errorResponse);

        // Access Token 만료 시
        if (errorResponse.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // 이미 토큰 재발급 갱신 중이라면 대기
                return new Promise((resolve, reject) => {
                    const resolveSubscriber = (token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosClient(originalRequest));
                    };
                    const rejectSubscriber = (err: any) => {
                        reject(err);
                    }
                    addRefreshSubscriber(resolveSubscriber, rejectSubscriber);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { setAccessToken } = useAuthStore.getState();
                
                // 재발급 요청
                const res = await axiosRefreshClient.post<{ accessToken: string }>("/auth/token/refresh");
                const newToken = res.data.accessToken;

                setAccessToken(newToken);

                // 대기 중인 요청 모두 시도
                onRefreshed(newToken);
                return axiosClient(originalRequest);
            } catch (refreshError) {
                const { logout } = useAuthStore.getState();
                logout();
                onRefreshedFailed(refreshError);

                return Promise.reject(toErrorResponse(refreshError as AxiosError));
            } finally {
                isRefreshing = false;
            }
        }
        
        // 일반적인 에러 응답 반환
        return Promise.reject(errorResponse);
    }
)

export default axiosClient;