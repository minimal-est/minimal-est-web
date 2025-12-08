import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Bookmark } from 'lucide-react';
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
            label: '내 글 관리',
            path: '/articles/manage',
            icon: BookOpen,
            public: false,
        },
    ];

    const filteredNavItems = navItems.filter(item => item.public || isSignedIn);

    return (
        <aside className={`fixed left-0 top-0 h-screen w-48 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 pt-16 transition-all duration-300 z-40 ${!isOpen ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0`}>
            <nav className="flex flex-col gap-0 px-4 py-3">
                {filteredNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 px-2 py-2 text-sm transition-opacity ${
                                active
                                    ? 'text-gray-900 dark:text-white font-semibold opacity-100'
                                    : 'text-gray-600 dark:text-gray-400 opacity-60 hover:opacity-100'
                            }`}
                        >
                            <Icon size={16} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};
