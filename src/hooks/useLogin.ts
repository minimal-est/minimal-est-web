import { loginApi } from "@/apis/auth"
import type { ErrorResponse, LoginRequest, LoginResponse } from "@/apis/types"
import { useAuthStore } from "@/stores/authStore"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {
    const {} = useAuthStore();

    return useMutation<LoginResponse, ErrorResponse, LoginRequest>({
        mutationFn: loginApi,
        onSuccess: (data) => {
        },
        onError: (error) => {
        }
    });
}