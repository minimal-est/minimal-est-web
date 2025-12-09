import { BlogCreateForm } from "@/features/blog-creation";
import { Logo } from "@/shared/ui";

export const BlogCreatePage = () => {
    return (
        <div className="w-full min-h-screen bg-white dark:bg-gray-950 flex flex-col">
            {/* Logo */}
            <div className="pt-6 px-4">
                <Logo />
            </div>

            {/* Content */}
            <div className="flex items-center justify-center flex-1 px-4">
                <BlogCreateForm />
            </div>
        </div>
    );
};
