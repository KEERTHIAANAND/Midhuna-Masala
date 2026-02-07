'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, ShoppingCart, LogOut, Loader2, Package,
    MapPin, Phone, Edit2, Settings, ChevronRight, Star,
    CreditCard, Bell, Shield, Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Tab Configuration
const TABS = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
            setIsLoggingOut(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#8B1E1E]" />
            </div>
        );
    }

    // Mock "Member Since" date
    const memberSince = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-[#FFFDF5] relative isolate">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
                style={{ backgroundImage: 'radial-gradient(#8B1E1E 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 animate-in fade-in duration-700">

                {/* Page Title */}
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl font-serif font-bold text-[#8B1E1E] tracking-tight">My Profile</h1>
                    <p className="text-gray-500 mt-2 text-lg">Manage your personal information and orders.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Identity Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-[#8B1E1E]/5 border border-[#E5D2C5]"
                        >
                            {/* Decorative Top Banner */}
                            <div className="h-32 bg-gradient-to-br from-[#8B1E1E] via-[#7A1A1A] to-[#6B1616] relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')]"></div>
                                {/* Abstract Shine */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            </div>

                            <div className="px-6 pb-8 text-center relative">
                                {/* Avatar - Overlapping Banner */}
                                <div className="-mt-16 mb-4 relative inline-block">
                                    <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-lg mx-auto">
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#F6C84C] to-[#D4AF37] flex items-center justify-center text-[#8B1E1E] text-4xl font-bold font-serif shadow-inner">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    </div>
                                    {/* Verification Badge */}
                                    <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full border-4 border-white shadow-sm" title="Verified Account">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* User Info */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 font-serif">{user.name}</h2>
                                    <p className="text-gray-500 text-sm mt-1">{user.email}</p>

                                    <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs font-medium text-gray-500">Member since {memberSince}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 my-6"></div>

                                {/* Stats Vertical Layout */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#FFFDF5] border border-transparent hover:border-[#E5D2C5] transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#8B1E1E]/10 flex items-center justify-center text-[#8B1E1E] group-hover:bg-[#8B1E1E] group-hover:text-white transition-colors">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">Total Orders</span>
                                        </div>
                                        <span className="font-bold text-gray-900">0</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#FFFDF5] border border-transparent hover:border-[#E5D2C5] transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#F6C84C]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#F6C84C] group-hover:text-white transition-colors">
                                                <ShoppingCart className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">Cart Items</span>
                                        </div>
                                        <span className="font-bold text-gray-900">0</span>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full mt-6 py-3 rounded-xl border border-red-100 text-red-600 font-semibold hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2 group/logout disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 group-hover/logout:translate-x-1 transition-transform" />}
                                    {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Content Area */}
                    <div className="lg:col-span-8">

                        {/* Tab Navigation */}
                        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as 'overview' | 'orders' | 'settings')}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border
                                        ${activeTab === tab.id
                                            ? 'bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-lg shadow-[#8B1E1E]/20'
                                            : 'bg-white text-gray-500 border-transparent hover:border-[#E5D2C5] hover:text-[#8B1E1E]'
                                        }
                                    `}
                                >
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-current'}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-3xl p-8 shadow-xl shadow-[#8B1E1E]/5 border border-[#E5D2C5] min-h-[400px]"
                            >
                                {activeTab === 'overview' && (
                                    <div className="space-y-10">
                                        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                                            <h2 className="text-2xl font-serif font-bold text-gray-800">Account Overview</h2>
                                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                Active Status
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Recent Orders Card */}
                                            <div onClick={() => setActiveTab('orders')} className="group relative overflow-hidden bg-gradient-to-br from-[#FFFDF5] to-white p-6 rounded-2xl border border-[#E5D2C5] hover:border-[#8B1E1E] hover:shadow-lg transition-all cursor-pointer">
                                                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <ChevronRight className="w-5 h-5 text-[#8B1E1E]" />
                                                </div>
                                                <div className="w-12 h-12 rounded-xl bg-[#8B1E1E]/5 flex items-center justify-center text-[#8B1E1E] mb-4 group-hover:scale-110 transition-transform">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <h3 className="font-bold text-lg text-gray-800">Orders History</h3>
                                                <p className="text-gray-500 text-sm mt-1 mb-4">View and track your past purchases.</p>
                                                <span className="text-xs font-bold text-[#8B1E1E] uppercase tracking-wider group-hover:underline">View All Orders</span>
                                            </div>

                                            {/* Shipping Addresses Card */}
                                            <div onClick={() => setActiveTab('settings')} className="group relative overflow-hidden bg-gradient-to-br from-[#FFFDF5] to-white p-6 rounded-2xl border border-[#E5D2C5] hover:border-[#D4AF37] hover:shadow-lg transition-all cursor-pointer">
                                                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
                                                </div>
                                                <div className="w-12 h-12 rounded-xl bg-[#F6C84C]/10 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                                                    <MapPin className="w-6 h-6" />
                                                </div>
                                                <h3 className="font-bold text-lg text-gray-800">Addresses</h3>
                                                <p className="text-gray-500 text-sm mt-1 mb-4">Manage your shipping destinations.</p>
                                                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider group-hover:underline">Manage Addresses</span>
                                            </div>
                                        </div>

                                        {/* Latest Activity Section */}
                                        <div className="pt-4">
                                            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                                <Star className="w-4 h-4 text-[#F6C84C]" />
                                                Timeline
                                            </h3>

                                            <div className="space-y-0">
                                                {/* Start Item */}
                                                <div className="flex gap-4 group">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow-sm z-10">
                                                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                                        </div>
                                                        <div className="w-0.5 h-12 bg-gray-100 group-last:hidden"></div>
                                                    </div>
                                                    <div className="pb-8">
                                                        <p className="font-bold text-gray-800 text-sm">Account Activated</p>
                                                        <p className="text-xs text-gray-500 mt-1">Welcome to the Midhuna Masala family! You&apos;re all set to explore authentic flavors.</p>
                                                    </div>
                                                </div>

                                                {/* Suggestion Item (Empty State) */}
                                                <div className="flex gap-4 group opacity-60">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border-4 border-white shadow-sm z-10">
                                                            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-600 text-sm">Next Step: First Order</p>
                                                        <p className="text-xs text-gray-400 mt-1">Browse our collection and place your first order to see it tracked here.</p>
                                                        <Link href="/shop" className="text-xs font-bold text-[#8B1E1E] mt-2 inline-block hover:underline">Start Shopping &rarr;</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'orders' && (
                                    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
                                        <div className="w-32 h-32 bg-gradient-to-br from-[#FFFDF5] to-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                                            <Package className="w-12 h-12 text-gray-300" />
                                        </div>
                                        <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">No Past Orders</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                            We're waiting to spice up your kitchen! Your order history will appear here.
                                        </p>
                                        <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-[#8B1E1E] text-white rounded-xl font-bold hover:bg-[#6B1616] transition-all hover:shadow-lg hover:shadow-[#8B1E1E]/30 transform hover:-translate-y-1">
                                            <ShoppingCart className="w-5 h-5" />
                                            Shop Now
                                        </Link>
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="space-y-10 animate-in fade-in duration-500">
                                        {/* Profile Section */}
                                        <section>
                                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                                <User className="w-5 h-5 text-[#8B1E1E]" />
                                                Personal Details
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                                        <User className="w-5 h-5 text-gray-400" />
                                                        <span className="font-semibold text-gray-700">{user.name}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-75 cursor-not-allowed">
                                                        <Mail className="w-5 h-5 text-gray-400" />
                                                        <span className="font-semibold text-gray-700">{user.email}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                                                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#8B1E1E] transition-colors cursor-pointer group">
                                                        <Phone className="w-5 h-5 text-gray-400 group-hover:text-[#8B1E1E] transition-colors" />
                                                        <span className="font-semibold text-gray-700">{user.phone || 'Add phone number'}</span>
                                                        <Edit2 className="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#8B1E1E]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Preferences */}
                                        <section className="border-t border-gray-100 pt-8">
                                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                                <Settings className="w-5 h-5 text-[#8B1E1E]" />
                                                Account Preferences
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Order Notifications</p>
                                                        <p className="text-sm text-gray-500">Get text/email updates about delivery.</p>
                                                    </div>
                                                    <div className="w-12 h-6 bg-[#8B1E1E] rounded-full relative shadow-inner transition-colors">
                                                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Marketing Emails</p>
                                                        <p className="text-sm text-gray-500">Receive exclusive offers and recipes.</p>
                                                    </div>
                                                    <div className="w-12 h-6 bg-gray-200 rounded-full relative shadow-inner transition-colors">
                                                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
