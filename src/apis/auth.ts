import axiosClient from "./axiosClient";
import { type RefreshResponse, type LoginRequest, type LoginResponse } from "./types";

export const loginApi = async(req: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>("/auth/token", req);
    return response.data;
}

export const refreshApi = async(): Promise<RefreshResponse> => {
    const response = await axiosClient.post<RefreshResponse>("/auth/token/refresh");
    return response.data;
}