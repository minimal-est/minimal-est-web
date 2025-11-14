import {MainHeader} from "@/widgets/main-header/ui";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
    return (
        <div>
            <MainHeader />
            <main>
                <Outlet />
            </main>
        </div>
    )
}