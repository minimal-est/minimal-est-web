import { useState } from "react";
import { BlogAboutWidget } from "@/widgets/blog-about/ui/BlogAboutWidget"
import { BlogAuthorWidget } from "@/widgets/blog-author/ui/BlogAuthorWidget";
import { BlogArticleListWidget } from "@/widgets/blog-article-list/ui";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/entities/user/lib";
import { Settings } from "lucide-react";
import { BlogSettingsModal } from "@/features/blog-settings/ui";
import { useBlogDetails } from "@/entities/blog/lib/hooks";
import { updateBlogAbout, updateBlogProfileImage } from "@/entities/blog/api";
import { useQueryClient } from "@tanstack/react-query";
import { blogKeys } from "@/entities/blog/lib";

export const BlogPage = () => {
    const { penName } = useParams<{penName: string}>();
    const { penName: currentUserPenName, blogId } = useAuthStore();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const queryClient = useQueryClient();

    if (!penName || penName.length < 2) {
        throw new Error("올바르지 않은 블로그");
    }

    // 현재 블로그 정보 가져오기
    const { data: blogDetails } = useBlogDetails(penName);

    // 블로그 소유자인지 확인
    const isOwner = currentUserPenName === penName;

    const handleSaveAbout = async (about: string) => {
        if (!penName) {
            throw new Error("블로그 정보가 없습니다.");
        }

        await updateBlogAbout(penName, about);

        // 캐시 무효화
        await queryClient.invalidateQueries({ queryKey: blogKeys.details(penName) });
    };

    const handleSaveProfileImage = async (file: File) => {
        if (!blogId) {
            throw new Error("블로그 정보가 없습니다.");
        }

        const result = await updateBlogProfileImage(blogId, file);

        // authStore의 프로필 이미지 URL 업데이트
        const { setBlogInfo } = useAuthStore.getState();
        if (currentUserPenName && result.profileImageUrl) {
            setBlogInfo(blogId, currentUserPenName, result.profileImageUrl);
        }

        // 캐시 무효화
        await queryClient.invalidateQueries({ queryKey: blogKeys.details(penName) });
    };

    return (
        <>
            <div className="w-full py-8 px-4 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-2xl mx-auto flex flex-col md:flex-row md:gap-12">
                    <div className="flex-1">
                        <BlogAboutWidget penName={penName} />
                    </div>
                    <div className="md:flex-shrink-0 mt-6 md:mt-0">
                        <BlogAuthorWidget penName={penName} />
                    </div>
                </div>
            </div>

            <div className="w-full py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <BlogArticleListWidget penName={penName} limit={10} showAuthor={false} />
                </div>
            </div>

            {/* Floating Settings Button - 블로그 소유자에게만 표시 */}
            {isOwner && (
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="fixed bottom-8 right-8 z-40 inline-flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 shadow-lg transition-colors"
                    title="블로그 설정"
                >
                    <Settings size={20} />
                    <span className="font-medium">설정</span>
                </button>
            )}

            {/* Settings Modal */}
            <BlogSettingsModal
                isOpen={isSettingsOpen && !!blogDetails}
                onClose={() => setIsSettingsOpen(false)}
                currentAbout={blogDetails?.about || ""}
                currentProfileImageUrl={blogDetails?.author.profileImageUrl || ""}
                onSaveAbout={handleSaveAbout}
                onSaveProfileImage={handleSaveProfileImage}
            />
        </>
    )
}