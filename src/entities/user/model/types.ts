export interface AuthInfo {
    uuid: string;
}

export interface BlogInfo {
    blogId: string;
    penName: string;
}

export interface AuthState {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    authInfo: AuthInfo | null;
    setAuthInfo: (authInfo: AuthInfo) => void;
    isSignedIn: boolean;
    setIsSignedIn: (state: boolean) => void;
    signIn: (token: string) => void;
    signOut: () => void;
}

export interface UserState {
    blogInfo: BlogInfo | null;
    setBlogInfo: (blogInfo: BlogInfo) => void;
    clearBlogInfo: () => void;
    hasBlog: () => boolean;
}

export interface JwtPayload {
    sub: string;
}