import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "./authStore"
import { userQueryKeys } from "./queryKeys";
import { blogApi } from "../api";
import { logoutUser } from "@/entities/auth/api/authApi";

/**
 * 블로그 정보를 가져오는 훅 (내부용)
 * useRequireBlog와 Provider에서만 사용됨
 *
 * 재시도 정책:
 * - 네트워크 오류: 최대 2번 재시도 (지수 백오프)
 * - 404 (블로그 없음): 재시도 안함
 * - 401 (인증 오류): Interceptor가 자동으로 토큰 갱신
 */
export const useFetchBlogInfo = () => {
    const { isSignedIn } = useAuth();
    const { setBlogInfo, clearBlogInfo } = useAuthStore();

    const { isLoading, error } = useQuery({
        queryKey: userQueryKeys.blogInfo(),
        queryFn: async () => {
            const data = await blogApi.fetchBlogSelf();
            setBlogInfo(data.blogId, data.author.penName, data.author.profileImageUrl);
            return data;
        },
        enabled: isSignedIn,
        staleTime: 1000 * 60 * 60, // 1시간
        retry: (failureCount, error: any) => {
            // 404 에러 (블로그 없음)는 재시도 안함
            if (error?.status === 404) {
                clearBlogInfo();
                return false;
            }
            // 네트워크 오류나 기타 에러는 최대 2번 재시도
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
    });

    return { isLoading, error };
};

/**
 * 로그인 상태만 필요한 경우 사용
 * 동기적이고 빠르며 로딩 상태가 없음
 *
 * @returns { isSignedIn, accessToken, authInfo, penName, blogId }
 */
export const useAuth = () => {
    const state = useAuthStore();
    return {
        isSignedIn: state.isSignedIn,
        accessToken: state.accessToken,
        authInfo: state.authInfo,
        penName: state.penName,
        blogId: state.blogId,
    };
};

/**
 * 로그인이 필수인 경우 사용
 * Route guard나 로그인 필수 컴포넌트에서 사용
 *
 * @returns { isSignedIn, isLoading, accessToken, penName, blogId }
 */
export const useRequireAuth = () => {
    const { isSignedIn, accessToken, penName, blogId } = useAuthStore();

    // 로그인 없으면 즉시 반환 (useFetchBlogInfo 호출 X)
    if (!isSignedIn) {
        return {
            isSignedIn: false,
            isLoading: false,
            accessToken: null,
            penName: null,
            blogId: null,
        };
    }

    // 로그인 상태면 그냥 상태 반환 (로딩 없음)
    return {
        isSignedIn: true,
        isLoading: false,
        accessToken,
        penName,
        blogId,
    };
};

/**
 * 로그인 + 블로그가 필수인 경우 사용
 * 블로그 정보가 필요한 Route guard에서만 사용
 *
 * @returns { isSignedIn, blogId, penName, isLoading }
 */
export const useRequireBlog = () => {
    const { isSignedIn, blogId, penName } = useAuthStore();
    const { isLoading } = useFetchBlogInfo();

    return {
        isSignedIn,
        blogId,
        penName,
        isLoading,
    };
};

/**
 * 로그아웃 hook
 * API 호출 후 로그인 상태를 초기화
 */
export const useLogout = () => {
    const { signOut } = useAuthStore();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            signOut();
        },
    });
};