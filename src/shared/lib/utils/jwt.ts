import { jwtDecode } from "jwt-decode";

/**
 * JWT 토큰을 파싱하여 페이로드를 반환합니다.
 *
 * @param token - JWT 토큰
 * @returns 파싱된 페이로드 또는 null (파싱 실패 시)
 */
export const parseJwt = <T>(token: string): T | null => {
    try {
        return jwtDecode<T>(token);
    } catch(err) {
        console.error("올바르지 않은 토큰입니다.", err);
        return null;
    }
}

/**
 * JWT 토큰의 만료 여부를 클라이언트에서 체크합니다.
 *
 * JWT의 핵심 원칙:
 * - 서명 검증은 서버가 함 (클라이언트는 비밀키 없음)
 * - 만료 시간(exp)은 클라이언트에서 체크 가능
 * - 위조 여부는 서버가 자동으로 거부함
 *
 * @param token - JWT 액세스 토큰
 * @returns true: 만료됨, false: 유효함 (만료 안됨)
 * @throws 파싱 실패 시 예외 발생
 */
export const isTokenExpired = (token: string): boolean => {
    const decoded = jwtDecode<{ exp?: number }>(token);

    // exp 필드가 없으면 보안상 만료된 것으로 간주
    if (!decoded.exp) {
        console.warn("[JWT] exp 필드가 없습니다. 보안상 무효 처리합니다.");
        return true;
    }

    // exp는 초 단위 Unix timestamp
    // Date.now()는 밀리초 단위이므로 1000으로 나눔
    const currentTime = Math.floor(Date.now() / 1000);

    // 현재 시간이 만료 시간을 초과하면 만료됨
    const expired = currentTime > decoded.exp;

    if (expired) {
        console.log(`[JWT] 토큰이 만료되었습니다. (exp: ${decoded.exp}, now: ${currentTime})`);
    }

    return expired;
}

/**
 * JWT 토큰이 유효한지 확인합니다 (파싱 가능 & 만료되지 않음).
 *
 * @param token - JWT 액세스 토큰
 * @returns true: 유효함, false: 무효 (null, 파싱 실패, 만료됨)
 */
export const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    try {
        return !isTokenExpired(token);
    } catch (err) {
        // 파싱 실패 → 무효
        console.error("[JWT] 토큰 검증 실패:", err);
        return false;
    }
}
