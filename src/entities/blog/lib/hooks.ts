import { useQuery } from "@tanstack/react-query"
import { blogKeys } from "./queryKeys"
import { getBlogDetails } from "../api/blogApi"

export const useBlogDetails = (penName: string) => {
    return useQuery({
        queryKey: blogKeys.details(penName),
        queryFn: () => getBlogDetails(penName),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 0,
    });
}