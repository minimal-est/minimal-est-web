import { MainHeader } from "@/widgets/main-header/ui";
import { MainSidebar } from "@/widgets/main-sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <MainHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex flex-1 relative">
                {/* 모바일 오버레이 */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 lg:hidden z-30"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                <MainSidebar isOpen={isSidebarOpen} />
                <main className={`flex-1 transition-all duration-300 lg:ml-48`}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}