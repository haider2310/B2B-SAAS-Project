'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlobalSearch } from '@/components/layout/global-search';
import { Logo } from '@/components/ui/logo';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Phone,
    CheckSquare,
    LifeBuoy,
    Settings,
    BarChart3,
    Zap,
    Radio,
    Bell,
    ChevronDown,
    Search
} from 'lucide-react';

const navItems = [
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Companies', href: '/dashboard/companies', icon: Briefcase },
    { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
    { name: 'Deals', href: '/dashboard/deals', icon: BarChart3 },
    { name: 'Calls', href: '/dashboard/calls', icon: Phone },
    { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
];

const automationItems = [
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Inbound Automation', href: '/dashboard/automation/inbound', icon: Zap },
    { name: 'Outbound Automation', href: '/dashboard/automation/outbound', icon: Radio },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    const NavItem = ({ item }: { item: { name: string; href: string; icon: any } }) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
            <Link
                href={item.href}
                className={`
                    flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm font-medium
                    ${isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                `}
            >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
                <span>{item.name}</span>
            </Link>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
            {/* Sidebar Section */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Logo />
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
                    <nav className="flex flex-col gap-1">
                        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            CRM
                        </div>
                        {navItems.map((item) => (
                            <NavItem key={item.href} item={item} />
                        ))}

                        <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Automation
                        </div>

                        {automationItems.map((item) => (
                            <NavItem key={item.href} item={item} />
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <Link href="/dashboard/settings" className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-slate-800 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold shadow-lg">
                            HA
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">Haider Aftab</div>
                            <div className="text-xs text-slate-500">Admin</div>
                        </div>
                        <Settings className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center gap-4">
                        <Breadcrumbs />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-900 border-none rounded-full focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                            />
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative rounded-full hover:bg-indigo-50 dark:hover:bg-slate-700">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-8 relative">
                    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500 slide-in-from-bottom-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}