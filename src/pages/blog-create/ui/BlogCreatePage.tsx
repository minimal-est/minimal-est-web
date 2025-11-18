import { BlogCreateForm } from "@/features/blog-creation";

export const BlogCreatePage = () => {
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
            <BlogCreateForm />
        </div>
    );
};
