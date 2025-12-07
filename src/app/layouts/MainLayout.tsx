import { MainHeader } from "@/widgets/main-header/ui";
import { MainSidebar } from "@/widgets/main-sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex flex-col min-h-screen">
            <MainHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex flex-1">
                <MainSidebar isOpen={isSidebarOpen} />
                <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-56' : 'lg:ml-0'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}