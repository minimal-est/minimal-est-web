import { loginApi } from "@/apis/auth"
import type { ErrorResponse, LoginRequest, LoginResponse } from "@/apis/types"
import { useAuthStore } from "@/stores/authStore"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {
    const { login } = useAuthStore();

    return useMutation<LoginResponse, ErrorResponse, LoginRequest>({
        mutationFn: loginApi,
        onSuccess: (data) => {
            login(data.accessToken); 
        }
    });
}