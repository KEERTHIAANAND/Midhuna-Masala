'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutGrid, ShoppingBag, ShoppingCart, Package,
    BarChart3, Settings, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

// Navigation Items Configuration
const NAV_ITEMS = [
    { name: 'Garden View', icon: LayoutGrid, href: '/admin' },
    { name: 'Spice Catalog', icon: ShoppingBag, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
    { name: 'Inventory', icon: Package, href: '/admin/inventory' },
    { name: 'Sales Growth', icon: BarChart3, href: '/admin/reports' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

interface AdminNavbarProps {
    user: { name?: string | null } | null;
    onLogout: () => void;
}

export default function AdminNavbar({ user, onLogout }: AdminNavbarProps) {
    const pathname = usePathname();

    // Determine active state: exact match for /admin, startsWith for sub-routes
    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* 1. TOP BRANDING BAR */}
            <div className="bg-white px-3 sm:px-6 py-3 flex items-center justify-between border-b border-[#F3EFEA]">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-base sm:text-xl font-serif font-bold text-[#7A1A1A] leading-tight">Midhuna Masala</h1>
                        <p className="text-[8px] sm:text-[9px] font-bold text-[#D4AF37] tracking-[0.12em] uppercase">Traditional Stone Ground Spices</p>
                    </div>
                </div>

                {/* Profile - Click to go to Settings */}
                <Link href="/admin/settings" className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{user?.name || 'Admin User'}</p>
                        <p className="text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#7A1A1A] text-[#F6C84C] flex items-center justify-center font-serif font-bold text-lg shadow-md border-2 border-[#F6C84C]">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                </Link>
            </div>

            {/* 2. NAVIGATION STRIP */}
            <div className="bg-[#7A1A1A] text-white px-2 sm:px-6 shadow-xl shadow-[#7A1A1A]/10 sticky top-0 z-40">
                <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
                    <nav className="flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all relative group
                                        ${active ? 'text-white' : 'text-[#E5D2C5] hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <item.icon className={`w-4 h-4 ${active ? 'text-[#F6C84C]' : 'text-current group-hover:text-[#F6C84C]'}`} />
                                    <span className="whitespace-nowrap hidden sm:inline">{item.name}</span>

                                    {/* Active Indicator */}
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-[#F6C84C] rounded-t-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-xs font-bold text-[#E5D2C5] hover:text-red-200 uppercase tracking-wider py-4 pl-3 sm:pl-6 border-l border-white/10 ml-2 sm:ml-4 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}
