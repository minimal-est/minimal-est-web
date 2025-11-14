import { client } from "@/shared/api";
import type { SignupRequest } from "../model/types";

export interface SignupResponse {
    userUUID: string;
}

/**
 * 회원가입
 * @param signupRequest - 이메일과 비밀번호
 * @throws {ErrorResponse} API 에러
 */
export const signupUser = async (signupRequest: SignupRequest): Promise<SignupResponse> => {
    const response = await client.post<SignupResponse>(
        "/users",
        {
            email: signupRequest.email,
            password: signupRequest.password,
            confirmPassword: signupRequest.confirmPassword,
        }
    );

    return response.data;
};
