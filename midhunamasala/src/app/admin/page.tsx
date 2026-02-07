'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutGrid, ShoppingBag, ShoppingCart, Package,
    BarChart3, Settings, LogOut, Plus, Filter,
    Leaf, ChevronDown, Bell, Search, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

// Navigation Items Configuration
const NAV_ITEMS = [
    { name: 'Garden View', icon: LayoutGrid, href: '/admin', active: true },
    { name: 'Spice Catalog', icon: ShoppingBag, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders', badge: 5 },
    { name: 'Inventory', icon: Package, href: '/admin/inventory', notification: true },
    { name: 'Sales Growth', icon: BarChart3, href: '/admin/reports' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminDashboard() {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Auth Check
    useEffect(() => {
        if (!authLoading && !isAdmin && !isLoggingOut) router.replace('/login');
    }, [authLoading, isAdmin, router, isLoggingOut]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    if (authLoading || !isAdmin) {
        return (
            <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#8B1E1E] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800">

            {/* 1. TOP BRANDING BAR */}
            <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-[#F3EFEA]">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center text-[#7A1A1A] shadow-lg shadow-[#D4AF37]/20">
                        <Leaf className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-xl font-serif font-bold text-[#7A1A1A] leading-tight">Midhuna</h1>
                        <p className="text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase">Premium Spices</p>
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
            <div className="bg-[#7A1A1A] text-white px-6 shadow-xl shadow-[#7A1A1A]/10 sticky top-0 z-40">
                <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
                    <nav className="flex items-center gap-1">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all relative group
                                    ${item.active ? 'text-white' : 'text-[#E5D2C5] hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <item.icon className={`w-4 h-4 ${item.active ? 'text-[#F6C84C]' : 'text-current group-hover:text-[#F6C84C]'}`} />
                                <span className="whitespace-nowrap">{item.name}</span>

                                {/* Active Indicator */}
                                {item.active && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#F6C84C] rounded-t-full"
                                    />
                                )}

                                {/* Badge */}
                                {item.badge && (
                                    <span className="absolute top-2 right-0 w-4 h-4 bg-[#F6C84C] text-[#7A1A1A] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                        {item.badge}
                                    </span>
                                )}
                                {item.notification && (
                                    <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-[#F6C84C] rounded-full animate-pulse" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs font-bold text-[#E5D2C5] hover:text-red-200 uppercase tracking-wider py-4 pl-6 border-l border-white/10 ml-4 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* 3. MAIN DASHBOARD CONTENT */}
            <main className="p-6 max-w-[1600px] mx-auto space-y-8">

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-[#7A1A1A]">Dashboard</h2>
                        <p className="text-gray-500 mt-2">Welcome back, here&apos;s your daily spice briefing.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5D2C5] rounded-xl text-sm font-medium text-gray-700 hover:border-[#7A1A1A] transition-colors shadow-sm">
                            <Filter className="w-4 h-4" />
                            Filter View
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7A1A1A]/20 hover:bg-[#601010] transition-all hover:-translate-y-0.5">
                            <Plus className="w-4 h-4" />
                            Add New Harvest
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-[#F3EFEA] flex flex-col justify-between h-40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3" /> 12.5%
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#FFE4E6] flex items-center justify-center text-[#9F1239] mb-4 group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-4xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">1,248</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Orders</p>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-[#F3EFEA] flex flex-col justify-between h-40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                <ArrowDownRight className="w-3 h-3" /> 2.4%
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#92400E] mb-4 group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-4xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">86</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Stock Varieties</p>
                        </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-[#F3EFEA] flex flex-col justify-between h-40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3" /> 15%
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] mb-4 group-hover:scale-110 transition-transform">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-4xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">12</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Expiring Soon</p>
                        </div>
                    </motion.div>
                </div>

                {/* Graph Section */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 border border-[#F3EFEA] shadow-sm relative">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-serif font-bold text-[#7A1A1A]">Sales Overview</h3>
                            <p className="text-sm text-gray-500">Weekly revenue performance</p>
                        </div>
                        <select className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-lg px-3 py-2 outline-none focus:border-[#7A1A1A]">
                            <option>This Week</option>
                            <option>Last Month</option>
                        </select>
                    </div>

                    {/* Mock Graph Visualization */}
                    <div className="relative h-64 w-full">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-300 font-medium">
                            {['₹8000', '₹6000', '₹4000', '₹2000', '₹0'].map((label) => (
                                <div key={label} className="border-b border-dashed border-gray-100 pb-1 w-full flex items-end">
                                    <span className="w-10">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Curved Line SVG */}
                        <div className="absolute inset-0 ml-10">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0 80 C 20 75, 40 85, 60 50 S 90 20, 100 30 V 100 H 0 Z"
                                    fill="url(#chartGradient)"
                                />
                                <path
                                    d="M0 80 C 20 75, 40 85, 60 50 S 90 20, 100 30"
                                    fill="none"
                                    stroke="#D4AF37"
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        </div>
                    </div>
                </motion.div>

            </main>
        </div>
    );
}
