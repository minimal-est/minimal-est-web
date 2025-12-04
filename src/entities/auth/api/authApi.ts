import { client } from "@/shared/api";
import type { LoginRequest, AuthResponse } from "../model/types";

export interface AccessTokenResponse {
    accessToken: string;
}

/**
 * 로그인 (이메일 + 비밀번호)
 * @param loginRequest - 이메일과 비밀번호
 * @throws {ErrorResponse} API 에러
 */
export const loginUser = async (loginRequest: LoginRequest): Promise<AuthResponse> => {
    const response = await client.post<AccessTokenResponse>(
        "/auth/token",
        {
            email: loginRequest.email,
            password: loginRequest.password,
        }
    );

    return {
        accessToken: response.data.accessToken,
        user: {
            userId: "", // 백엔드에서 user 정보를 함께 반환하지 않으므로 별도 API 필요
            penName: "",
            email: loginRequest.email,
        },
    };
};

/**
 * 토큰 갱신 (리프레시 토큰)
 * @throws {ErrorResponse} API 에러
 */
export const refreshAccessToken = async (): Promise<AccessTokenResponse> => {
    const response = await client.post<AccessTokenResponse>("/auth/token/refresh");
    return response.data;
};

/**
 * 토큰 유효성 검증
 * 앱 시작 시 저장된 토큰이 여전히 유효한지 확인
 *
 * @returns { userId } 사용자 ID
 * @throws {ErrorResponse} 401 에러 (토큰 무효)
 */
export const validateToken = async (): Promise<{ userId: string }> => {
    const response = await client.get<{ userId: string }>("/auth/me");
    return response.data;
};

/**
 * 현재 사용자 정보 조회
 */
export const getCurrentUser = async () => {
    const response = await client.get("/users/me");
    return response.data;
};

/**
 * 로그아웃 (리프레시 토큰 제거)
 * @throws {ErrorResponse} API 에러
 */
export const logoutUser = async (): Promise<void> => {
    await client.post("/auth/logout");
};
