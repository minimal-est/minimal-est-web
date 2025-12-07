import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { MainLayout } from "@/app/layouts";
import { FeedPage } from "@/pages/feed/ui";
import { ArticleDetailPage } from "@/pages/article/ui";
import { ArticleCreatePage } from "@/pages/article-create/ui";
import { ArticleManagePage } from "@/pages/article-manage";
import { CollectionsPage } from "@/pages/collections";
import { BlogCreatePage } from "@/pages/blog-create";
import { SearchPage } from "@/pages/search";
import { LoginPage, SignupPage, VerifyEmailPage, VerificationExpiredPage, EmailSentPage } from "@/pages/auth/ui";
import { ErrorPage } from "@/pages/error/ui";
import { useRequireAuth, useRequireBlog } from "@/entities/user/lib";
import { Spinner } from "@/shared/ui/base";
import { toast } from "sonner";
import { PrivacyPolicy, Terms } from "@/pages/privacy/ui";

/**
 * 로그인이 필수인 Route 보호 컴포넌트
 * 블로그 정보는 필요 없음
 */
const RequireLoginRoute = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn } = useRequireAuth();

    if (!isSignedIn) {
        toast.info('로그인이 필요합니다.');
        return <Navigate to="/login" replace />;
    }

    return children;
};

/**
 * 로그인 + 블로그가 필수인 Route 보호 컴포넌트
 * 블로그 정보 로딩 상태 포함
 */
const RequireBlogRoute = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn, blogId, isLoading } = useRequireBlog();

    if (!isSignedIn) {
        toast.info('로그인이 필요합니다.');
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (!blogId) {
        toast.info('블로그를 먼저 개설해주세요!');
        return <Navigate to="/blog-create" replace />;
    }

    return children;
};

const router = createBrowserRouter([
    {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/terms",
        element: <Terms />,
        errorElement: <ErrorPage />,
    },
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
        path: "/auth/email-sent",
        element: <EmailSentPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/auth/email-verified",
        element: <VerifyEmailPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/auth/verify-failed",
        element: <VerificationExpiredPage />,
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
                // 검색
                path: "search",
                element: <SearchPage />,
            },
            {
                // 북마크 (컬렉션 관리 통합)
                path: "bookmarks",
                element: (
                    <RequireLoginRoute>
                        <CollectionsPage />
                    </RequireLoginRoute>
                ),
            },
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
                // 글 상세 보기 (slug 기반)
                path: "articles/:penName/:slug",
                element: <ArticleDetailPage />
            },
        ]
    }
]);

export const Router = () => {
    return <RouterProvider router={router} />
}