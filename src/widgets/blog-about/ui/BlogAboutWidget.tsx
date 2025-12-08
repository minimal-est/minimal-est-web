import { useBlogDetails } from "@/entities/blog/lib";
import { Spinner } from "@/shared/ui/base";

export const BlogAboutWidget = ({ penName }: {penName: string}) => {
    const { data: blogDetails, isPending, isError } = useBlogDetails(penName);

    if (isPending) {
        return (
            <div className="flex justify-center">
                <Spinner />
            </div>
        )
    }

    if (isError || !blogDetails) {
        throw new Error("블로그를 불러오는데 실패했습니다.");
    }

    return (
        <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                About
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {blogDetails.about && blogDetails.about.length > 0
                    ? blogDetails.about
                    : `반갑습니다 👋 저는 ${blogDetails.author.penName}로 활동하고 있습니다.`
                }
            </p>
        </div>
    )
}