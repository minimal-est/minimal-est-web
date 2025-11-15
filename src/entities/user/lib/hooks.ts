import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "./authStore"
import { userQueryKeys } from "./queryKeys";
import { blogApi } from "../api";

export const useFetchBlogInfo = () => {
    const { authInfo, setBlogInfo } = useAuthStore();
    
    const { isLoading, error } = useQuery({
        queryKey: userQueryKeys.blogInfo(),
        queryFn: async () => {
            const data = await blogApi.fetchBlogSelf();
            setBlogInfo(data.blogId, data.penName);
            return data;
        },
        enabled: !!authInfo?.userId,
        staleTime: 1000 * 60 * 60, // 1시간
    });

    return { isLoading, error };
}