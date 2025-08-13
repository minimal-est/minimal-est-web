export interface ErrorResponse {
    status: number;
    title: string;
    detail: string;
    properties: {} | null;
}

export interface JwtPayload {
    sub: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
}

export interface RefreshResponse {
    accessToken: string;
}