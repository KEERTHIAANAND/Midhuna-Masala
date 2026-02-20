'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    ShoppingBag, Package,
    BarChart3, Bell, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminNavbar from '@/components/admin/AdminNavbar';


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
        <div className="h-screen bg-[#FDFBF7] font-sans text-gray-800 flex flex-col overflow-hidden">

            <AdminNavbar user={user} onLogout={handleLogout} />

            {/* 3. MAIN DASHBOARD CONTENT */}
            <main className="flex-1 p-4 max-w-[1600px] mx-auto w-full flex flex-col gap-4 overflow-hidden">

                {/* Header Actions */}
                <div>
                    <h2 className="text-4xl font-serif font-bold text-[#7A1A1A]">Dashboard</h2>
                    <p className="text-gray-500 mt-2">Welcome back, here&apos;s your daily spice briefing.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1 */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-5 rounded-2xl shadow-sm border border-[#F3EFEA] flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3" /> 0%
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#FFE4E6] flex items-center justify-center text-[#9F1239] mb-4 group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-4xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">0</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Orders</p>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-5 rounded-2xl shadow-sm border border-[#F3EFEA] flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                <ArrowDownRight className="w-3 h-3" /> 0%
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#92400E] mb-4 group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-4xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">0</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Stock Varieties</p>
                        </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-5 rounded-2xl shadow-sm border border-[#F3EFEA] flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3" /> 0%
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] mb-4 group-hover:scale-110 transition-transform">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-4xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">0</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Expiring Soon</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-[#F3EFEA] shadow-sm relative flex-1 min-h-0">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-serif font-bold text-[#7A1A1A]">Sales Overview</h3>
                            <p className="text-sm text-gray-500">Weekly revenue performance</p>
                        </div>
                        <select className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-lg px-3 py-2 outline-none focus:border-[#7A1A1A]">
                            <option>This Week</option>
                            <option>Last Month</option>
                        </select>
                    </div>

                    {/* Empty State */}
                    <div className="relative h-[calc(100%-60px)] w-full flex flex-col items-center justify-center">
                        <BarChart3 className="w-12 h-12 text-gray-200 mb-3" />
                        <p className="text-sm font-medium text-gray-400">No sales data yet</p>
                        <p className="text-xs text-gray-300 mt-1">Data will appear here once orders are placed</p>
                    </div>
                </motion.div>

            </main>
        </div>
    );
}
