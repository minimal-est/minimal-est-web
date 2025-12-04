import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, PenTool, Bookmark } from 'lucide-react';
import { useAuth } from '@/entities/user/lib';

interface MainSidebarProps {
    isOpen: boolean;
}

export const MainSidebar = ({ isOpen }: MainSidebarProps) => {
    const { isSignedIn } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const navItems = [
        {
            label: '홈',
            path: '/',
            icon: Home,
            public: true,
        },
        {
            label: '북마크',
            path: '/bookmarks',
            icon: Bookmark,
            public: false,
        },
        {
            label: '글 작성',
            path: '/articles/create',
            icon: PenTool,
            public: false,
        },
        {
            label: '내 글',
            path: '/articles/manage',
            icon: BookOpen,
            public: false,
        },
    ];

    const filteredNavItems = navItems.filter(item => item.public || isSignedIn);

    return (
        <aside className={`hidden lg:block fixed left-0 top-0 h-screen w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 pt-20 transition-all duration-300 ${!isOpen ? '-translate-x-full' : ''}`}>
            <nav className="flex flex-col gap-1 px-3 py-4">
                {filteredNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                active
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};
