import { useBlogDetails } from "@/entities/blog/lib";
import { ProfileAvatar } from "@/entities/blog/ui";
import { Spinner } from "@/shared/ui/base";

export const BlogAuthorWidget = ({penName}: {penName: string}) => {
    const { data: blogDetails, isPending } = useBlogDetails(penName);

    if (isPending || !blogDetails) {
        return (
            <Spinner />
        )
    }

    return (
        <div className="flex flex-col items-center md:items-start gap-4 p-4 md:p-0 rounded-lg md:rounded-none bg-gray-50 dark:bg-gray-950 md:bg-transparent md:dark:bg-transparent">
            <ProfileAvatar
                penName={blogDetails.author.penName}
                size="lg"
                profileImageUrl={blogDetails.author.profileImageUrl}
                clickable={true}
            />
            <div className="text-center md:text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {blogDetails.author.penName}
                </p>
            </div>
        </div>
    )
}