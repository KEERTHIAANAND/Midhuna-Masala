'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutGrid, ShoppingBag, ShoppingCart, Package,
    BarChart3, Settings, LogOut, Bell, Shield, Lock,
    Leaf, User, Mail, Phone, Save, Pencil, Check
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
    { name: 'Sales Growth', icon: BarChart3, href: '/admin/reports' },
    { name: 'Settings', icon: Settings, href: '/admin/settings', active: true },
];

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-[#D4AF37]' : 'bg-gray-200'
                }`}
        >
            <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${enabled ? 'left-7' : 'left-1'
                    }`}
            />
        </button>
    );
}

export default function SettingsPage() {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Form state
    const [fullName, setFullName] = useState('Keerthi Aanand K S');
    const [email, setEmail] = useState('admin@midhunamasala.com');
    const [phone, setPhone] = useState('+91 98765 43210');
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Notification toggles
    const [lowStockAlerts, setLowStockAlerts] = useState(true);
    const [dailySalesReport, setDailySalesReport] = useState(false);
    const [newOrderReceived, setNewOrderReceived] = useState(true);
    const [customerReviews, setCustomerReviews] = useState(true);

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
                    <div>
                        <h1 className="text-xl font-serif font-bold text-[#7A1A1A] leading-tight">Midhuna Masala</h1>
                        <p className="text-[9px] font-bold text-[#D4AF37] tracking-[0.12em] uppercase">Traditional Stone Ground Spices</p>
                    </div>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{user?.name || 'Admin User'}</p>
                        <p className="text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#7A1A1A] text-[#F6C84C] flex items-center justify-center font-serif font-bold text-lg shadow-md border-2 border-[#F6C84C]">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                </div>
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
                        <h2 className="text-4xl font-serif font-bold text-[#7A1A1A]">Configuration</h2>
                        <p className="text-gray-500 mt-1">Manage system parameters and preferences</p>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7A1A1A]/20 hover:bg-[#601010] transition-all">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Profile */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white rounded-2xl border border-[#F3EFEA] shadow-sm p-6 relative"
                    >
                        {/* Edit Icon */}
                        <button
                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                            className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isEditingProfile
                                ? 'bg-[#7A1A1A] text-white'
                                : 'bg-gray-100 hover:bg-[#7A1A1A] text-gray-500 hover:text-white'
                                }`}
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-[#7A1A1A] text-[#F6C84C] flex items-center justify-center font-serif font-bold text-4xl shadow-lg border-4 border-[#F6C84C]">
                                    K
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <h3 className="mt-4 text-xl font-serif font-bold text-[#7A1A1A]">Keerthi Aanand K S</h3>
                            <p className="text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase mt-1">Super Admin</p>
                        </div>

                        {/* Profile Fields */}
                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-bold text-[#7A1A1A] uppercase tracking-wider mb-2">
                                    <User className="w-3 h-3" />
                                    Full Name
                                </label>
                                {isEditingProfile ? (
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-[#7A1A1A] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800">
                                        {fullName}
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-bold text-[#7A1A1A] uppercase tracking-wider mb-2">
                                    <Mail className="w-3 h-3" />
                                    Email Address
                                </label>
                                {isEditingProfile ? (
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-[#7A1A1A] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800">
                                        {email}
                                    </div>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-bold text-[#7A1A1A] uppercase tracking-wider mb-2">
                                    <Phone className="w-3 h-3" />
                                    Phone
                                </label>
                                {isEditingProfile ? (
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-[#7A1A1A] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800">
                                        {phone}
                                    </div>
                                )}
                            </div>

                            {/* Save Button (only in edit mode) */}
                            {isEditingProfile && (
                                <button
                                    onClick={() => setIsEditingProfile(false)}
                                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-[#7A1A1A] text-white rounded-xl text-sm font-medium hover:bg-[#601010] transition-colors"
                                >
                                    <Check className="w-4 h-4" />
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Column - Settings */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Notifications Section */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-[#F3EFEA] shadow-sm p-6"
                        >
                            {/* Section Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-[#7A1A1A]">Notifications</h3>
                                    <p className="text-xs text-gray-500">Control when and how you get alerted</p>
                                </div>
                            </div>

                            {/* Toggle Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Low Stock Alerts */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-800">Low Stock Alerts</p>
                                        <p className="text-xs text-gray-500">Notify when stock is below 20 units</p>
                                    </div>
                                    <ToggleSwitch enabled={lowStockAlerts} onChange={() => setLowStockAlerts(!lowStockAlerts)} />
                                </div>

                                {/* New Order Received */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-800">New Order Received</p>
                                        <p className="text-xs text-gray-500">Email alert for every new order</p>
                                    </div>
                                    <ToggleSwitch enabled={newOrderReceived} onChange={() => setNewOrderReceived(!newOrderReceived)} />
                                </div>

                                {/* Daily Sales Report */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-800">Daily Sales Report</p>
                                        <p className="text-xs text-gray-500">End of day summary at 10:00 PM</p>
                                    </div>
                                    <ToggleSwitch enabled={dailySalesReport} onChange={() => setDailySalesReport(!dailySalesReport)} />
                                </div>

                                {/* Customer Reviews */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-800">Customer Reviews</p>
                                        <p className="text-xs text-gray-500">When a customer leaves 4+ star rating</p>
                                    </div>
                                    <ToggleSwitch enabled={customerReviews} onChange={() => setCustomerReviews(!customerReviews)} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Security & Access Section */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-[#F3EFEA] shadow-sm p-6"
                        >
                            {/* Section Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-[#7A1A1A]" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-[#7A1A1A]">Security & Access</h3>
                                    <p className="text-xs text-gray-500">Manage password and team access</p>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Password</p>
                                        <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <button className="text-[#7A1A1A] text-sm font-medium hover:underline">
                                    Change
                                </button>
                            </div>
                        </motion.div>

                    </div>
                </div>

            </main>
        </div>
    );
}
