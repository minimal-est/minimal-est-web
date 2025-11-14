import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/app/layouts";
import { FeedPage } from "@/pages/feed/ui";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <FeedPage /> },
        ]
    }
]);