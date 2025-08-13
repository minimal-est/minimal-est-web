export const parseJwt = <T>(token: string): T | null => {
    try {
        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));
        return JSON.parse(payload) as T;
    } catch(err) {
        console.error("올바르지 않은 토큰입니다.", err);
        return null;
    }
}