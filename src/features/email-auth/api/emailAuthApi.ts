import { client } from "@/shared/api";
import type { SignupRequest } from "@/entities/auth/model/types";

/**
 * 이메일 인증 기반 회원가입 신청
 *
 * @param signupRequest - { email, password, confirmPassword }
 * @returns 메시지 (확인 메일이 전송됨)
 * @throws {ErrorResponse} API 에러
 *   - 400: 유효하지 않은 입력
 *   - 409: 이미 존재하는 이메일
 *   - 429: 1시간 내 5회 이상 시도 (레이트 리밋)
 */
export const signupWithEmailVerification = async (
    signupRequest: SignupRequest
): Promise<{ message: string }> => {
    const response = await client.post<{ message: string }>(
        "/auth/signup",
        {
            email: signupRequest.email,
            password: signupRequest.password,
            confirmPassword: signupRequest.confirmPassword,
        }
    );

    return response.data;
};
