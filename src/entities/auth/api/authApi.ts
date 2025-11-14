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
 * 현재 사용자 정보 조회
 */
export const getCurrentUser = async () => {
    // TODO: 백엔드에서 현재 사용자 정보를 반환하는 API 확인
    const response = await client.get("/api/v1/users/me");
    return response.data;
};
