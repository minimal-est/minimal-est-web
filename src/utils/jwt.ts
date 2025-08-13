import { jwtDecode } from "jwt-decode";

export const parseJwt = <T>(token: string): T | null => {
    try {
        return jwtDecode<T>(token);
    } catch(err) {
        console.error("올바르지 않은 토큰입니다.", err);
        return null;
    }
}