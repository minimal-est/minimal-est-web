import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { MainLayout } from "@/app/layouts";
import { FeedPage } from "@/pages/feed/ui";
import { ArticleDetailPage } from "@/pages/article/ui";
import { ArticleCreatePage } from "@/pages/article-create/ui";
import { ArticleManagePage } from "@/pages/article-manage";
import { BlogCreatePage } from "@/pages/blog-create";
import { LoginPage, SignupPage } from "@/pages/auth/ui";
import { ErrorPage } from "@/pages/error/ui";
import { useAuthStore, useFetchBlogInfo } from "@/entities/user/lib";
import { Spinner } from "@/shared/ui/base";
import { toast } from "sonner";

// Protected Route Component - 로그인 체크
const RequireLoginRoute = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn } = useAuthStore();

    if (!isSignedIn) {
        toast.info('로그인이 필요합니다.'); 
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Protected Route Component - 블로그 체크
const RequireBlogRoute = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn, blogId } = useAuthStore();
    const { isLoading } = useFetchBlogInfo();

    if (!isSignedIn) {
        toast.info('로그인이 필요합니다.');
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <Spinner />
        </div>;
    }

    if (!blogId) {
        toast.info('블로그를 먼저 개설해주세요!');
        return <Navigate to="/blog-create" replace />;
    }

    return children;
};

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/signup",
        element: <SignupPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/blog-create",
        element: (
            <RequireLoginRoute>
                <BlogCreatePage />
            </RequireLoginRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <FeedPage /> },
            {
                // 글 작성
                path: "articles/create",
                element: (
                    <RequireBlogRoute>
                        <ArticleCreatePage isEditMode={false} />
                    </RequireBlogRoute>
                ),
            },
            {
                // 내 글 관리
                path: "articles/manage",
                element: (
                    <RequireBlogRoute>
                        <ArticleManagePage />
                    </RequireBlogRoute>
                ),
            },
            {
                // 글 작성 또는 편집 (API의 status로 모드 결정)
                // PUBLISHED 글 → 수정 (수정완료)
                // DRAFT 글 → 작성 (저장/발행)
                path: "write/:articleId",
                element: (
                    <RequireBlogRoute>
                        <ArticleCreatePage isEditMode={false} />
                    </RequireBlogRoute>
                ),
            },
            {
                // 글 상세 보기
                path: "articles/:penName/:articleId",
                element: <ArticleDetailPage />
            },
        ]
    }
]);

export const Router = () => {
    return <RouterProvider router={router} />
}