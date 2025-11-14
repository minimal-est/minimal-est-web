export interface User {
    userId: string;
    penName: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}
