import { useNavigate } from "react-router-dom";

interface ProfileAvatarProps {
    penName: string;
    profileImageUrl?: string | null;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    clickable?: boolean;
}

const sizeConfig = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-lg",
    lg: "h-16 w-16 text-2xl",
    xl: "h-24 w-24 text-3xl",
};

/**
 * 프로필 아바타 - 이미지 또는 이니셜 표시
 */
export const ProfileAvatar = ({
    penName,
    profileImageUrl,
    size = "md",
    clickable = false,
}: ProfileAvatarProps) => {
    const navigate = useNavigate();
    const sizeClass = sizeConfig[size];
    const initial = penName.charAt(0).toUpperCase();

    const handleClick = () => {
        if (clickable) {
            navigate(`/b/${penName}`);
        }
    };

    const cursorClass = clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : "";

    // 이미지가 있으면 이미지 표시
    if (profileImageUrl) {
        return (
            <img
                src={profileImageUrl}
                alt={penName}
                onClick={handleClick}
                className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${cursorClass}`}
            />
        );
    }

    // 이미지가 없으면 이니셜 표시
    return (
        <div
            onClick={handleClick}
            className={`${sizeClass} flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold flex-shrink-0 ${cursorClass}`}
        >
            {initial}
        </div>
    );
};
