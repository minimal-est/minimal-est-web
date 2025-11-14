import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { MainLayout } from "@/app/layouts";
import { FeedPage } from "@/pages/feed/ui";
import { ArticleDetailPage } from "@/pages/article/ui";
import { ArticleCreatePage } from "@/pages/article-create/ui";
import { BlogCreatePage } from "@/pages/blog-create";
import { LoginPage, SignupPage } from "@/pages/auth/ui";
import { ErrorPage } from "@/pages/error/ui";
import { useAuthStore } from "@/entities/auth/model";
import { useUserStore } from "@/entities/user/model";

// Protected Route Component - 로그인 체크
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { accessToken } = useAuthStore();

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Protected Route Component - 블로그 체크
const RequireBlogRoute = ({ children }: { children: React.ReactNode }) => {
    const { accessToken } = useAuthStore();
    const { hasBlog } = useUserStore();

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (!hasBlog()) {
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
            <ProtectedRoute>
                <BlogCreatePage />
            </ProtectedRoute>
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
                path: "/create",
                element: (
                    <RequireBlogRoute>
                        <ArticleCreatePage />
                    </RequireBlogRoute>
                ),
            },
            { path: "/:penName/:articleId", element: <ArticleDetailPage /> },
        ]
    }
]);

export const Router = () => {
    return <RouterProvider router={router} />
}