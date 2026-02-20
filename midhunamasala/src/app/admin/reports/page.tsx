'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    BarChart3, TrendingUp, TrendingDown,
    ChevronDown, ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminNavbar from '@/components/admin/AdminNavbar';


// Revenue Data (Weekly)
const REVENUE_DATA: { day: string; value: number }[] = [];

// Category Sales Data
const CATEGORY_DATA: { name: string; value: number; color: string }[] = [];

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

    const maxRevenue = REVENUE_DATA.length > 0 ? Math.max(...REVENUE_DATA.map(d => d.value)) : 1;

    if (authLoading || !isAdmin) {
        return (
            <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#8B1E1E] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800">

            <AdminNavbar user={user} onLogout={handleLogout} />

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
                        <h3 className="text-4xl font-serif font-bold tabular-nums lining-nums">₹0</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 text-white/70 text-xs font-bold rounded">
                                <TrendingUp className="w-3 h-3" />
                                0%
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
                        <h3 className="text-4xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">0</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-bold">
                                <TrendingUp className="w-3 h-3" />
                                0%
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
                        <h3 className="text-4xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">₹0</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-bold">
                                <TrendingDown className="w-3 h-3" />
                                0%
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
                        {REVENUE_DATA.length > 0 ? (
                            <div className="h-64 flex items-end justify-between gap-3 px-2">
                                {REVENUE_DATA.map((item, index) => (
                                    <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(item.value / maxRevenue) * 100}%` }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                            className="w-full bg-gradient-to-t from-[#D4AF37] to-[#F6C84C] rounded-t-lg min-h-[20px] relative group cursor-pointer hover:from-[#C4A030] hover:to-[#E5B740] transition-colors"
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#7A1A1A] text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                ₹{item.value.toLocaleString()}
                                            </div>
                                        </motion.div>
                                        <span className="text-xs text-gray-500 font-medium">{item.day}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center">
                                <BarChart3 className="w-12 h-12 text-gray-200 mb-3" />
                                <p className="text-sm font-medium text-gray-400">No revenue data yet</p>
                                <p className="text-xs text-gray-300 mt-1">Revenue trends will appear here</p>
                            </div>
                        )}
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
                            {CATEGORY_DATA.length > 0 ? (
                                <>
                                    {/* Donut Chart */}
                                    <div className="relative w-56 h-56">
                                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                            {(() => {
                                                let cumulativePercent = 0;
                                                return CATEGORY_DATA.map((category) => {
                                                    const percent = category.value;
                                                    const strokeDasharray = `${percent} ${100 - percent}`;
                                                    const strokeDashoffset = -cumulativePercent;
                                                    cumulativePercent += percent;
                                                    return (
                                                        <circle
                                                            key={category.name}
                                                            cx="50" cy="50" r="40"
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
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-serif font-bold text-[#7A1A1A]">100%</span>
                                            <span className="text-xs text-gray-400">Total Sales</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                                        {CATEGORY_DATA.map((category) => (
                                            <div key={category.name} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                                                <span className="text-xs text-gray-600">{category.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <ShoppingBag className="w-12 h-12 text-gray-200 mb-3" />
                                    <p className="text-sm font-medium text-gray-400">No category data yet</p>
                                    <p className="text-xs text-gray-300 mt-1">Category breakdown will appear here</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

            </main>
        </div>
    );
}
