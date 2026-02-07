'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutGrid, ShoppingBag, ShoppingCart, Package,
    BarChart3, Settings, LogOut, TrendingUp, TrendingDown,
    Leaf, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

// Navigation Items Configuration
const NAV_ITEMS = [
    { name: 'Garden View', icon: LayoutGrid, href: '/admin' },
    { name: 'Spice Catalog', icon: ShoppingBag, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders', badge: 5 },
    { name: 'Inventory', icon: Package, href: '/admin/inventory', notification: true },
    { name: 'Sales Growth', icon: BarChart3, href: '/admin/reports', active: true },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

// Revenue Data (Weekly)
const REVENUE_DATA = [
    { day: 'Mon', value: 3200 },
    { day: 'Tue', value: 4100 },
    { day: 'Wed', value: 3800 },
    { day: 'Thu', value: 4500 },
    { day: 'Fri', value: 6200 },
    { day: 'Sat', value: 7100 },
    { day: 'Sun', value: 6800 },
];

// Category Sales Data
const CATEGORY_DATA = [
    { name: 'Ground Spices', value: 45, color: '#7A1A1A' },
    { name: 'Whole Spices', value: 28, color: '#D4AF37' },
    { name: 'Blends', value: 18, color: '#C45C26' },
    { name: 'Herbs', value: 9, color: '#9CA3AF' },
];

export default function SalesGrowthPage() {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [dateRange, setDateRange] = useState('Last 30 Days');

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

    const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.value));

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
                    <div>
                        <h1 className="text-xl font-serif font-bold text-[#7A1A1A] leading-tight">Midhuna Masala</h1>
                        <p className="text-[9px] font-bold text-[#D4AF37] tracking-[0.12em] uppercase">Traditional Stone Ground Spices</p>
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

                                {item.active && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#F6C84C] rounded-t-full"
                                    />
                                )}

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

            {/* 3. MAIN CONTENT */}
            <main className="p-6 max-w-[1600px] mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-[#7A1A1A]">Performance Analytics</h2>
                        <p className="text-gray-500 mt-1">Deep dive into sales and growth metrics</p>
                    </div>

                    {/* Date Range Dropdown */}
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="appearance-none bg-white border border-[#E5D2C5] rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#7A1A1A] cursor-pointer"
                        >
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Last 90 Days</option>
                            <option>This Year</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Revenue Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-[#7A1A1A] p-6 rounded-2xl text-white relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#F6C84C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-2">Total Revenue</p>
                        <h3 className="text-4xl font-serif font-bold tabular-nums lining-nums">₹12,45,000</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">
                                <TrendingUp className="w-3 h-3" />
                                +15%
                            </span>
                            <span className="text-white/70 text-xs">vs last month</span>
                        </div>
                    </motion.div>

                    {/* Total Orders Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-[#F3EFEA] shadow-sm"
                    >
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Orders</p>
                        <h3 className="text-4xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">1,248</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold">
                                <TrendingUp className="w-3 h-3" />
                                +8.2%
                            </span>
                            <span className="text-gray-400 text-xs">vs last month</span>
                        </div>
                    </motion.div>

                    {/* Avg Order Value Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-2xl border border-[#F3EFEA] shadow-sm"
                    >
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Avg. Order Value</p>
                        <h3 className="text-4xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">₹980</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-red-500 text-xs font-bold">
                                <TrendingDown className="w-3 h-3" />
                                -2.1%
                            </span>
                            <span className="text-gray-400 text-xs">vs last month</span>
                        </div>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Revenue Trend Chart */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-2xl border border-[#F3EFEA] shadow-sm"
                    >
                        <h3 className="text-lg font-serif font-bold text-[#7A1A1A] mb-6">Revenue Trend</h3>

                        {/* Bar Chart */}
                        <div className="h-64 flex items-end justify-between gap-3 px-2">
                            {REVENUE_DATA.map((item, index) => (
                                <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(item.value / maxRevenue) * 100}%` }}
                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                        className="w-full bg-gradient-to-t from-[#D4AF37] to-[#F6C84C] rounded-t-lg min-h-[20px] relative group cursor-pointer hover:from-[#C4A030] hover:to-[#E5B740] transition-colors"
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#7A1A1A] text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            ₹{item.value.toLocaleString()}
                                        </div>
                                    </motion.div>
                                    <span className="text-xs text-gray-500 font-medium">{item.day}</span>
                                </div>
                            ))}
                        </div>

                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-16 bottom-16 w-12 flex flex-col justify-between text-right pr-2 text-[10px] text-gray-400">
                            <span>₹8k</span>
                            <span>₹6k</span>
                            <span>₹4k</span>
                            <span>₹2k</span>
                            <span>₹0k</span>
                        </div>
                    </motion.div>

                    {/* Sales by Category Chart */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-6 rounded-2xl border border-[#F3EFEA] shadow-sm"
                    >
                        <h3 className="text-lg font-serif font-bold text-[#7A1A1A] mb-6">Sales by Category</h3>

                        <div className="flex items-center justify-center">
                            {/* Donut Chart */}
                            <div className="relative w-56 h-56">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    {(() => {
                                        let cumulativePercent = 0;
                                        return CATEGORY_DATA.map((category, index) => {
                                            const percent = category.value;
                                            const strokeDasharray = `${percent} ${100 - percent}`;
                                            const strokeDashoffset = -cumulativePercent;
                                            cumulativePercent += percent;

                                            return (
                                                <circle
                                                    key={category.name}
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    fill="transparent"
                                                    stroke={category.color}
                                                    strokeWidth="20"
                                                    strokeDasharray={strokeDasharray}
                                                    strokeDashoffset={strokeDashoffset}
                                                    className="transition-all duration-500"
                                                    style={{
                                                        strokeDasharray: `${percent * 2.51} ${251.2 - percent * 2.51}`,
                                                        strokeDashoffset: -cumulativePercent * 2.51 + percent * 2.51
                                                    }}
                                                />
                                            );
                                        });
                                    })()}
                                </svg>

                                {/* Center text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-serif font-bold text-[#7A1A1A]">100%</span>
                                    <span className="text-xs text-gray-400">Total Sales</span>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                            {CATEGORY_DATA.map((category) => (
                                <div key={category.name} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: category.color }}
                                    ></div>
                                    <span className="text-xs text-gray-600">{category.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </main>
        </div>
    );
}
