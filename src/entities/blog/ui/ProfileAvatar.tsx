interface ProfileAvatarProps {
    penName: string;
    profileImageUrl?: string | null;
    size?: "sm" | "md" | "lg";
}

const sizeConfig = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-lg",
    lg: "h-16 w-16 text-2xl",
};

/**
 * 프로필 아바타 - 이미지 또는 이니셜 표시
 */
export const ProfileAvatar = ({
    penName,
    profileImageUrl,
    size = "md",
}: ProfileAvatarProps) => {
    const sizeClass = sizeConfig[size];
    const initial = penName.charAt(0).toUpperCase();

    // 이미지가 있으면 이미지 표시
    if (profileImageUrl) {
        return (
            <img
                src={profileImageUrl}
                alt={penName}
                className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
            />
        );
    }

    // 이미지가 없으면 이니셜 표시
    return (
        <div
            className={`${sizeClass} flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold flex-shrink-0`}
        >
            {initial}
        </div>
    );
};
