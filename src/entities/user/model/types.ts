export interface JwtPayload {
    sub: string;
}

// 토큰에서 추출한 인증 정보를 정의합니다.
export interface AuthInfo {
    userId: string;
}

export interface AuthState {
    // state
    accessToken: string | null;
    authInfo: AuthInfo | null;
    isSignedIn: boolean;
    blogId: string | null;
    penName: string | null;

    // action
    setAccessToken: (token: string) => void;
    signIn: (token: string) => void;
    signOut: () => void;
    setBlogInfo: (blogId: string, penName: string) => void;
    clearBlogInfo: () => void;
}
