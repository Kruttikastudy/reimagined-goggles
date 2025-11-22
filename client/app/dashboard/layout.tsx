'use client';

import {
    LayoutDashboard, FilePlus, ClipboardList,
    Stethoscope, Trophy, Smartphone, Settings,
    LogOut, Shield
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: FilePlus, label: 'Add Report', href: '/dashboard/reports/new' },
        { icon: ClipboardList, label: 'Action Plan', href: '/dashboard/plan' },
        { icon: Stethoscope, label: 'Contact Doctors', href: '/dashboard/doctors' },
        { icon: Trophy, label: 'Community Challenges', href: '/dashboard/community' },
        { icon: Smartphone, label: 'Connect Devices', href: '/dashboard/devices' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xl">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Shield size={18} />
                        </div>
                        MediGuard
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group ${isActive
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <item.icon
                                        size={20}
                                        className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                                            }`}
                                    />
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <main className="flex-1 ml-64 overflow-y-auto h-full relative">
                {children}
            </main>
        </div>
    );
}
