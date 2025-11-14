import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import ArticlePublishedDate from "@/entities/article/ui/ArticlePublishedDate.tsx";
import {UserIcon} from "lucide-react";

interface ArticleMetaProps {
    penName: string;
    avatarUrl?: string;
    completedAt: Date;
}

export const ArticleMeta = ({ penName, avatarUrl, completedAt }: ArticleMetaProps) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar>
                <AvatarImage src={avatarUrl} alt={penName} />
                <AvatarFallback><UserIcon /></AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-semibold">{penName}</p>
                <ArticlePublishedDate publishedDate={completedAt} />
            </div>
        </div>
    )
}