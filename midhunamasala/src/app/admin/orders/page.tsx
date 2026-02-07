'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutGrid, ShoppingBag, ShoppingCart, Package,
    BarChart3, Settings, LogOut, Download, Filter, Search,
    Leaf, MoreVertical, Eye, Truck, CheckCircle, XCircle, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

// Navigation Items Configuration
const NAV_ITEMS = [
    { name: 'Garden View', icon: LayoutGrid, href: '/admin' },
    { name: 'Spice Catalog', icon: ShoppingBag, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders', active: true, badge: 5 },
    { name: 'Inventory', icon: Package, href: '/admin/inventory', notification: true },
    { name: 'Sales Growth', icon: BarChart3, href: '/admin/reports' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

// Status Filters
const STATUS_FILTERS = ['All Orders', 'Pending', 'Processing', 'Shipped', 'Delivered'];

// Status Badge Colors
const STATUS_STYLES: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'PROCESSING': 'bg-gray-100 text-gray-600 border-gray-200',
    'SHIPPED': 'bg-orange-100 text-orange-600 border-orange-200',
    'DELIVERED': 'bg-green-100 text-green-600 border-green-200',
    'CANCELLED': 'bg-red-100 text-red-600 border-red-200',
};

// Mock Orders Data
const ORDERS = [
    {
        id: 'MM-9082',
        customer: { name: 'Anjali Menon', initial: 'A', color: 'bg-purple-100 text-purple-600' },
        date: 'Oct 24, 2023',
        items: 3,
        amount: 1250,
        payment: 'UPI',
        status: 'PENDING'
    },
    {
        id: 'MM-9081',
        customer: { name: 'Rahul Verma', initial: 'R', color: 'bg-blue-100 text-blue-600' },
        date: 'Oct 24, 2023',
        items: 8,
        amount: 3400,
        payment: 'UPI',
        status: 'SHIPPED'
    },
    {
        id: 'MM-9080',
        customer: { name: 'Priya Sharma', initial: 'P', color: 'bg-pink-100 text-pink-600' },
        date: 'Oct 23, 2023',
        items: 2,
        amount: 850,
        payment: 'UPI',
        status: 'DELIVERED'
    },
    {
        id: 'MM-9079',
        customer: { name: 'The Taj Kitchen', initial: 'T', color: 'bg-amber-100 text-amber-600' },
        date: 'Oct 23, 2023',
        items: 25,
        amount: 12100,
        payment: 'UPI',
        status: 'PROCESSING'
    },
    {
        id: 'MM-9078',
        customer: { name: 'Sneha Gupta', initial: 'S', color: 'bg-teal-100 text-teal-600' },
        date: 'Oct 22, 2023',
        items: 1,
        amount: 560,
        payment: 'UPI',
        status: 'DELIVERED'
    },
    {
        id: 'MM-9077',
        customer: { name: 'Anjali Menon', initial: 'A', color: 'bg-purple-100 text-purple-600' },
        date: 'Oct 24, 2023',
        items: 3,
        amount: 1250,
        payment: 'UPI',
        status: 'PENDING'
    },
    {
        id: 'MM-9076',
        customer: { name: 'Rahul Verma', initial: 'R', color: 'bg-blue-100 text-blue-600' },
        date: 'Oct 24, 2023',
        items: 8,
        amount: 3400,
        payment: 'UPI',
        status: 'SHIPPED'
    },
    {
        id: 'MM-9075',
        customer: { name: 'Priya Sharma', initial: 'P', color: 'bg-pink-100 text-pink-600' },
        date: 'Oct 23, 2023',
        items: 2,
        amount: 850,
        payment: 'UPI',
        status: 'DELIVERED'
    },
    {
        id: 'MM-9074',
        customer: { name: 'The Taj Kitchen', initial: 'T', color: 'bg-amber-100 text-amber-600' },
        date: 'Oct 23, 2023',
        items: 25,
        amount: 12100,
        payment: 'UPI',
        status: 'PROCESSING'
    },
    {
        id: 'MM-9073',
        customer: { name: 'Sneha Gupta', initial: 'S', color: 'bg-teal-100 text-teal-600' },
        date: 'Oct 22, 2023',
        items: 1,
        amount: 560,
        payment: 'UPI',
        status: 'DELIVERED'
    },
];

export default function OrdersPage() {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All Orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

    const filteredOrders = ORDERS.filter(order => {
        const matchesFilter = activeFilter === 'All Orders' ||
            order.status.toLowerCase() === activeFilter.toLowerCase();
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

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
                        <h2 className="text-4xl font-serif font-bold text-[#7A1A1A]">Orders & Shipments</h2>
                        <p className="text-gray-500 mt-1">Track wholesale and retail distribution</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5D2C5] rounded-xl text-sm font-medium text-gray-700 hover:border-[#7A1A1A] transition-colors shadow-sm">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7A1A1A]/20 hover:bg-[#601010] transition-all">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-2xl border border-[#F3EFEA] p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Status Tabs */}
                        <div className="flex items-center gap-1 overflow-x-auto">
                            {STATUS_FILTERS.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeFilter === filter
                                        ? 'text-[#7A1A1A] border-b-2 border-[#7A1A1A]'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search order ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-48 focus:outline-none focus:border-[#7A1A1A] focus:ring-1 focus:ring-[#7A1A1A]"
                            />
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl border border-[#F3EFEA] overflow-hidden shadow-sm">
                    {/* Table Header */}
                    <div className="grid grid-cols-8 gap-4 px-6 py-4 bg-gray-50/50 border-b border-[#F3EFEA] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <div>Order ID</div>
                        <div className="col-span-2">Customer</div>
                        <div>Date & Time</div>
                        <div>Items</div>
                        <div>Total Amount</div>
                        <div>Payment</div>
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span>Action</span>
                        </div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-[#F3EFEA]">
                        <AnimatePresence>
                            {filteredOrders.map((order, index) => (
                                <motion.div
                                    key={order.id + index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="grid grid-cols-8 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
                                >
                                    {/* Order ID */}
                                    <div className="font-serif font-bold text-[#7A1A1A]">#{order.id}</div>

                                    {/* Customer */}
                                    <div className="col-span-2 flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full ${order.customer.color} flex items-center justify-center font-bold text-sm`}>
                                            {order.customer.initial}
                                        </div>
                                        <span className="font-medium text-gray-800">{order.customer.name}</span>
                                    </div>

                                    {/* Date */}
                                    <div className="text-sm text-gray-500">{order.date}</div>

                                    {/* Items */}
                                    <div className="text-sm text-gray-600">{order.items} Items</div>

                                    {/* Amount */}
                                    <div className="font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">₹{order.amount.toLocaleString()}</div>

                                    {/* Payment */}
                                    <div>
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md border border-gray-200 uppercase">
                                            {order.payment}
                                        </span>
                                    </div>

                                    {/* Status & Action */}
                                    <div className="flex items-center justify-between">
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${STATUS_STYLES[order.status]} uppercase tracking-wide`}>
                                            {order.status}
                                        </span>

                                        {/* Action Menu */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === order.id + index ? null : order.id + index)}
                                                className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>

                                            <AnimatePresence>
                                                {openMenuId === order.id + index && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        className="absolute top-10 right-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[160px] z-10"
                                                    >
                                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Eye className="w-4 h-4" /> View Details
                                                        </button>
                                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Truck className="w-4 h-4" /> Update Status
                                                        </button>
                                                        <button className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4" /> Mark Delivered
                                                        </button>
                                                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                            <XCircle className="w-4 h-4" /> Cancel Order
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Load More */}
                    <div className="px-6 py-4 border-t border-[#F3EFEA] flex justify-center">
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#7A1A1A] transition-colors">
                            Load More Orders
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}
