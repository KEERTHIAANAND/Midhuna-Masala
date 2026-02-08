'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutGrid, ShoppingBag, ShoppingCart, Package,
    BarChart3, Settings, LogOut, Download, Filter, Search,
    Leaf, MoreVertical, Eye, Truck, CheckCircle, XCircle, ChevronDown, X, Printer
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
        id: 'MM-20260208-01',
        customer: { name: 'Anjali Menon', initial: 'A', color: 'bg-purple-100 text-purple-600' },
        date: 'Feb 08, 2026',
        items: 3,
        amount: 1250,
        payment: 'UPI',
        status: 'PENDING',
        products: [
            { name: 'Kashmiri Chilli Powder', weight: '250g', qty: 2, price: 320 },
            { name: 'Coriander Powder', weight: '500g', qty: 1, price: 280 },
            { name: 'Turmeric Powder', weight: '100g', qty: 1, price: 150 }
        ]
    },
    {
        id: 'MM-20260208-02',
        customer: { name: 'Rahul Verma', initial: 'R', color: 'bg-blue-100 text-blue-600' },
        date: 'Feb 08, 2026',
        items: 8,
        amount: 3400,
        payment: 'UPI',
        status: 'SHIPPED',
        products: [
            { name: 'Royal Garam Masala', weight: '100g', qty: 3, price: 320 },
            { name: 'Malabar Black Pepper', weight: '100g', qty: 2, price: 220 },
            { name: 'Star Anise Premium', weight: '50g', qty: 3, price: 280 }
        ]
    },
    {
        id: 'MM-20260208-03',
        customer: { name: 'Priya Sharma', initial: 'P', color: 'bg-pink-100 text-pink-600' },
        date: 'Feb 08, 2026',
        items: 2,
        amount: 850,
        payment: 'UPI',
        status: 'DELIVERED',
        products: [
            { name: 'Kashmiri Chilli Powder', weight: '500g', qty: 1, price: 450 },
            { name: 'Coriander Powder', weight: '250g', qty: 2, price: 160 }
        ]
    },
    {
        id: 'MM-20260207-01',
        customer: { name: 'The Taj Kitchen', initial: 'T', color: 'bg-amber-100 text-amber-600' },
        date: 'Feb 07, 2026',
        items: 25,
        amount: 12100,
        payment: 'UPI',
        status: 'PROCESSING',
        products: [
            { name: 'Kashmiri Chilli Powder', weight: '500g', qty: 10, price: 450 },
            { name: 'Royal Garam Masala', weight: '250g', qty: 8, price: 650 },
            { name: 'Coriander Powder', weight: '500g', qty: 5, price: 280 },
            { name: 'Turmeric Powder', weight: '1kg', qty: 2, price: 580 }
        ]
    },
    {
        id: 'MM-20260207-02',
        customer: { name: 'Sneha Gupta', initial: 'S', color: 'bg-teal-100 text-teal-600' },
        date: 'Feb 07, 2026',
        items: 1,
        amount: 560,
        payment: 'UPI',
        status: 'DELIVERED',
        products: [
            { name: 'Malabar Black Pepper', weight: '250g', qty: 1, price: 490 }
        ]
    },
    {
        id: 'MM-20260206-01',
        customer: { name: 'Anjali Menon', initial: 'A', color: 'bg-purple-100 text-purple-600' },
        date: 'Feb 06, 2026',
        items: 3,
        amount: 1250,
        payment: 'UPI',
        status: 'PENDING',
        products: [
            { name: 'Star Anise Premium', weight: '100g', qty: 1, price: 520 },
            { name: 'Coriander Powder', weight: '250g', qty: 2, price: 160 },
            { name: 'Turmeric Powder', weight: '250g', qty: 1, price: 180 }
        ]
    },
    {
        id: 'MM-20260206-02',
        customer: { name: 'Rahul Verma', initial: 'R', color: 'bg-blue-100 text-blue-600' },
        date: 'Feb 06, 2026',
        items: 8,
        amount: 3400,
        payment: 'UPI',
        status: 'SHIPPED',
        products: [
            { name: 'Royal Garam Masala', weight: '250g', qty: 4, price: 650 },
            { name: 'Kashmiri Chilli Powder', weight: '100g', qty: 4, price: 150 }
        ]
    },
    {
        id: 'MM-20260205-01',
        customer: { name: 'Priya Sharma', initial: 'P', color: 'bg-pink-100 text-pink-600' },
        date: 'Feb 05, 2026',
        items: 2,
        amount: 850,
        payment: 'UPI',
        status: 'DELIVERED',
        products: [
            { name: 'Malabar Black Pepper', weight: '100g', qty: 2, price: 220 },
            { name: 'Coriander Powder', weight: '500g', qty: 1, price: 280 }
        ]
    },
    {
        id: 'MM-20260205-02',
        customer: { name: 'The Taj Kitchen', initial: 'T', color: 'bg-amber-100 text-amber-600' },
        date: 'Feb 05, 2026',
        items: 25,
        amount: 12100,
        payment: 'UPI',
        status: 'PROCESSING',
        products: [
            { name: 'Kashmiri Chilli Powder', weight: '500g', qty: 12, price: 450 },
            { name: 'Royal Garam Masala', weight: '100g', qty: 8, price: 320 },
            { name: 'Turmeric Powder', weight: '500g', qty: 5, price: 320 }
        ]
    },
    {
        id: 'MM-20260204-01',
        customer: { name: 'Sneha Gupta', initial: 'S', color: 'bg-teal-100 text-teal-600' },
        date: 'Feb 04, 2026',
        items: 1,
        amount: 560,
        payment: 'UPI',
        status: 'DELIVERED',
        products: [
            { name: 'Star Anise Premium', weight: '100g', qty: 1, price: 520 }
        ]
    },
];

export default function OrdersPage() {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All Orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [orderSize, setOrderSize] = useState('all');
    const [priority, setPriority] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Order management state
    const [orders, setOrders] = useState(ORDERS);
    const [selectedOrder, setSelectedOrder] = useState<typeof ORDERS[0] | null>(null);
    const [viewOrderOpen, setViewOrderOpen] = useState(false);
    const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
    const [cancelOrderOpen, setCancelOrderOpen] = useState(false);

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

    const filteredOrders = orders.filter(order => {
        const matchesFilter = activeFilter === 'All Orders' ||
            order.status.toLowerCase() === activeFilter.toLowerCase();
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Order size filter (by items)
        let matchesSize = true;
        if (orderSize === 'single') matchesSize = order.items === 1;
        else if (orderSize === 'small') matchesSize = order.items >= 2 && order.items <= 5;
        else if (orderSize === 'bulk') matchesSize = order.items > 5;

        // Priority filter (by amount)
        let matchesPriority = true;
        if (priority === 'high') matchesPriority = order.amount >= 5000;
        else if (priority === 'medium') matchesPriority = order.amount >= 1000 && order.amount < 5000;
        else if (priority === 'low') matchesPriority = order.amount < 1000;

        return matchesFilter && matchesSearch && matchesSize && matchesPriority;
    }).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'highest') return b.amount - a.amount;
        if (sortBy === 'lowest') return a.amount - b.amount;
        if (sortBy === 'items_high') return b.items - a.items;
        if (sortBy === 'items_low') return a.items - b.items;
        return 0;
    });

    // Export CSV function
    const handleExportCSV = () => {
        const headers = ['Order ID', 'Customer', 'Date', 'Items', 'Amount', 'Payment', 'Status'];
        const csvData = filteredOrders.map(order => [
            order.id,
            order.customer.name,
            order.date,
            order.items,
            order.amount,
            order.payment,
            order.status
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5D2C5] rounded-xl text-sm font-medium text-gray-700 hover:border-[#7A1A1A] transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7A1A1A]/20 hover:bg-[#601010] transition-all"
                            >
                                <Filter className="w-4 h-4" />
                                Filter
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Filter Dropdown */}
                            <AnimatePresence>
                                {showFilterDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
                                    >
                                        <div className="p-4 space-y-4">
                                            {/* Order Size Filter */}
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Order Size</label>
                                                <select
                                                    value={orderSize}
                                                    onChange={(e) => setOrderSize(e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7A1A1A]"
                                                >
                                                    <option value="all">All Orders</option>
                                                    <option value="single">Single Item</option>
                                                    <option value="small">Small (2-5 Items)</option>
                                                    <option value="bulk">Bulk (6+ Items)</option>
                                                </select>
                                            </div>

                                            {/* Priority Filter */}
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Priority</label>
                                                <select
                                                    value={priority}
                                                    onChange={(e) => setPriority(e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7A1A1A]"
                                                >
                                                    <option value="all">All Priority</option>
                                                    <option value="high">High (₹5,000+)</option>
                                                    <option value="medium">Medium (₹1,000-₹5,000)</option>
                                                    <option value="low">Low (Under ₹1,000)</option>
                                                </select>
                                            </div>

                                            {/* Sort By Filter */}
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Sort By</label>
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7A1A1A]"
                                                >
                                                    <option value="newest">Date: Newest First</option>
                                                    <option value="oldest">Date: Oldest First</option>
                                                    <option value="highest">Amount: High to Low</option>
                                                    <option value="lowest">Amount: Low to High</option>
                                                    <option value="items_high">Items: Most First</option>
                                                    <option value="items_low">Items: Least First</option>
                                                </select>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={() => {
                                                        setOrderSize('all');
                                                        setPriority('all');
                                                        setSortBy('newest');
                                                    }}
                                                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={() => setShowFilterDropdown(false)}
                                                    className="flex-1 px-3 py-2 text-sm font-bold text-white bg-[#7A1A1A] rounded-lg hover:bg-[#601010]"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
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
                        <div>Status</div>
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
                                    <div className="font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">#{order.id}</div>

                                    {/* Customer - Clickable */}
                                    <div
                                        className="col-span-2 flex items-center gap-3 cursor-pointer group"
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setViewOrderOpen(true);
                                        }}
                                    >
                                        <div className={`w-8 h-8 rounded-full ${order.customer.color} flex items-center justify-center font-bold text-sm`}>
                                            {order.customer.initial}
                                        </div>
                                        <span className="font-medium text-gray-800 group-hover:text-[#7A1A1A] transition-colors underline-offset-2 group-hover:underline">
                                            {order.customer.name}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="text-sm text-gray-500">{order.date}</div>

                                    {/* Items */}
                                    <div className="text-sm text-gray-600 font-serif tabular-nums lining-nums">{order.items} Items</div>

                                    {/* Amount */}
                                    <div className="font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">₹{order.amount.toLocaleString()}</div>

                                    {/* Payment */}
                                    <div>
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md border border-gray-200 uppercase">
                                            {order.payment}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${STATUS_STYLES[order.status]} uppercase tracking-wide`}>
                                            {order.status}
                                        </span>
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

            {/* View Order Details Modal - Bill Format */}
            <AnimatePresence>
                {viewOrderOpen && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setViewOrderOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            {/* Bill Header */}
                            <div className="bg-gradient-to-r from-[#7A1A1A] to-[#601010] px-6 py-5 text-center relative">
                                <button
                                    onClick={() => setViewOrderOpen(false)}
                                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Leaf className="w-5 h-5 text-[#D4AF37]" />
                                    <h2 className="text-xl font-serif font-bold text-white">Midhuna Masala</h2>
                                </div>
                                <p className="text-[#D4AF37] text-xs font-medium tracking-wider">INVOICE</p>
                            </div>

                            {/* Order Info Bar */}
                            <div className="flex items-center justify-between px-6 py-3 bg-[#F5E9DB] border-b border-[#E5D5C5]">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Order ID</p>
                                    <p className="font-serif font-bold text-[#7A1A1A] text-sm">#{selectedOrder.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Date</p>
                                    <p className="font-medium text-gray-700 text-sm">{selectedOrder.date}</p>
                                </div>
                            </div>

                            {/* Customer & Payment Info */}
                            <div className="px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full ${selectedOrder.customer.color} flex items-center justify-center font-bold`}>
                                            {selectedOrder.customer.initial}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{selectedOrder.customer.name}</p>
                                            <p className="text-xs text-gray-500">Customer</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {/* Status Dropdown */}
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                setOrders(orders.map(o =>
                                                    o.id === selectedOrder.id ? { ...o, status: newStatus } : o
                                                ));
                                                setSelectedOrder({ ...selectedOrder, status: newStatus });
                                            }}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7A1A1A]/20 transition-all ${selectedOrder.status === 'DELIVERED' ? 'bg-green-50 border-green-300 text-green-700' :
                                                selectedOrder.status === 'SHIPPED' ? 'bg-blue-50 border-blue-300 text-blue-700' :
                                                    selectedOrder.status === 'PROCESSING' ? 'bg-orange-50 border-orange-300 text-orange-700' :
                                                        'bg-gray-50 border-gray-300 text-gray-700'
                                                }`}
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">{selectedOrder.payment}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Products Table */}
                            <div className="px-6 py-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-dashed border-gray-200">
                                            <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2">Item</th>
                                            <th className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2">Qty</th>
                                            <th className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2">Rate</th>
                                            <th className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedOrder.products.map((product, idx) => (
                                            <tr key={idx}>
                                                <td className="py-2.5">
                                                    <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                                                    <p className="text-xs text-gray-400">{product.weight}</p>
                                                </td>
                                                <td className="py-2.5 text-center">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 text-xs font-bold rounded">
                                                        {product.qty}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 text-right text-sm text-gray-600 tabular-nums lining-nums">₹{product.price}</td>
                                                <td className="py-2.5 text-right font-serif font-bold text-[#7A1A1A] text-sm tabular-nums lining-nums">₹{(product.price * product.qty).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Total Section */}
                            <div className="px-6 pb-4">
                                <div className="border-t-2 border-dashed border-gray-200 pt-3 space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Subtotal ({selectedOrder.items} items)</span>
                                        <span className="font-medium text-gray-700 tabular-nums lining-nums">₹{selectedOrder.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Delivery</span>
                                        <span className="font-medium text-green-600">FREE</span>
                                    </div>
                                </div>
                                <div className="border-t-2 border-gray-800 mt-3 pt-3 flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-800">Grand Total</span>
                                    <span className="text-2xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">₹{selectedOrder.amount.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 px-4 py-2.5 text-gray-600 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
                                >
                                    <Printer className="w-4 h-4" />
                                    Print Bill
                                </button>
                                <button
                                    onClick={() => setViewOrderOpen(false)}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold hover:bg-[#601010] transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Printable Invoice - Hidden on screen, visible only when printing */}
            {selectedOrder && (
                <div className="print-invoice hidden print:block">
                    {/* Invoice Header */}
                    <div className="flex items-start justify-between border-b-2 border-[#7A1A1A] pb-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 bg-[#7A1A1A] rounded-full flex items-center justify-center">
                                    <Leaf className="w-6 h-6 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-serif font-bold text-[#7A1A1A]">Midhuna Masala</h1>
                                    <p className="text-xs text-gray-500 italic">Premium Stone Ground Spices</p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-600 space-y-0.5 mt-3">
                                <p>No. 45, Spice Garden Road</p>
                                <p>Kochi, Kerala - 682001</p>
                                <p>Phone: +91 98765 43210</p>
                                <p>Email: orders@midhunamasala.com</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold text-[#7A1A1A] mb-2">INVOICE</h2>
                            <div className="text-sm space-y-1">
                                <p><span className="text-gray-500">Invoice No:</span> <span className="font-bold">{selectedOrder.id}</span></p>
                                <p><span className="text-gray-500">Date:</span> <span className="font-medium">{selectedOrder.date}</span></p>
                                <p><span className="text-gray-500">Status:</span> <span className="font-bold text-green-600">{selectedOrder.status}</span></p>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">GSTIN: 32AABCM1234A1ZM</p>
                        </div>
                    </div>

                    {/* Bill To Section */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
                        <p className="font-bold text-gray-800 text-lg">{selectedOrder.customer.name}</p>
                        <p className="text-sm text-gray-600">Payment Method: {selectedOrder.payment}</p>
                    </div>

                    {/* Products Table */}
                    <table className="w-full mb-6">
                        <thead>
                            <tr className="bg-[#7A1A1A] text-white">
                                <th className="text-left py-3 px-4 text-sm font-bold">S.No</th>
                                <th className="text-left py-3 px-4 text-sm font-bold">Item Description</th>
                                <th className="text-center py-3 px-4 text-sm font-bold">Weight</th>
                                <th className="text-center py-3 px-4 text-sm font-bold">Qty</th>
                                <th className="text-right py-3 px-4 text-sm font-bold">Rate (₹)</th>
                                <th className="text-right py-3 px-4 text-sm font-bold">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.products.map((product, idx) => (
                                <tr key={idx} className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-sm text-gray-600">{idx + 1}</td>
                                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{product.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600 text-center">{product.weight}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800 text-center font-bold">{product.qty}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600 text-right tabular-nums">{product.price.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-sm font-bold text-[#7A1A1A] text-right tabular-nums">{(product.price * product.qty).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals Section */}
                    <div className="flex justify-end mb-8">
                        <div className="w-72">
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium tabular-nums">₹{selectedOrder.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="text-gray-600">Delivery Charges</span>
                                <span className="font-medium text-green-600">FREE</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="text-gray-600">Tax (0%)</span>
                                <span className="font-medium tabular-nums">₹0.00</span>
                            </div>
                            <div className="flex justify-between py-3 bg-[#F5E9DB] px-3 rounded-lg mt-2">
                                <span className="text-lg font-bold text-gray-800">Grand Total</span>
                                <span className="text-xl font-bold text-[#7A1A1A] tabular-nums">₹{selectedOrder.amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Amount in Words */}
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Amount in Words:</p>
                        <p className="font-medium text-gray-800">Rupees {selectedOrder.amount.toLocaleString('en-IN')} Only</p>
                    </div>

                    {/* Terms & Footer */}
                    <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-6">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Terms & Conditions</p>
                                <ul className="text-xs text-gray-500 space-y-1">
                                    <li>• Goods once sold cannot be returned</li>
                                    <li>• Store in cool and dry place</li>
                                    <li>• Best before 12 months from packing</li>
                                    <li>• This is a computer generated invoice</li>
                                </ul>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">For Midhuna Masala</p>
                                <div className="h-12 mb-2"></div>
                                <p className="text-sm text-gray-600 border-t border-gray-300 pt-2">Authorized Signatory</p>
                            </div>
                        </div>
                    </div>

                    {/* Thank You Message */}
                    <div className="text-center mt-8 pt-4 border-t border-gray-200">
                        <p className="text-lg font-serif font-bold text-[#7A1A1A]">Thank you for your order!</p>
                        <p className="text-sm text-gray-500">Visit us at www.midhunamasala.com</p>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            <AnimatePresence>
                {updateStatusOpen && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setUpdateStatusOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-[#7A1A1A]">Update Status</h2>
                                    <p className="text-sm text-gray-500">#{selectedOrder.id}</p>
                                </div>
                                <button
                                    onClick={() => setUpdateStatusOpen(false)}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-5 space-y-2">
                                <p className="text-sm text-gray-500 mb-3">Select new status for this order:</p>

                                {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setOrders(orders.map(o =>
                                                o.id === selectedOrder.id ? { ...o, status } : o
                                            ));
                                            setSelectedOrder({ ...selectedOrder, status });
                                            setUpdateStatusOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all flex items-center justify-between ${selectedOrder.status === status
                                            ? 'bg-[#7A1A1A] text-white'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span>{status}</span>
                                        {selectedOrder.status === status && (
                                            <CheckCircle className="w-5 h-5" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
                                <button
                                    onClick={() => setUpdateStatusOpen(false)}
                                    className="px-6 py-2 text-gray-600 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cancel Order Confirmation Modal */}
            <AnimatePresence>
                {cancelOrderOpen && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setCancelOrderOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Cancel Order?</h2>
                                <p className="text-gray-500">
                                    Are you sure you want to cancel order <span className="font-bold text-[#7A1A1A]">#{selectedOrder.id}</span>?
                                    This will notify the customer.
                                </p>
                            </div>

                            {/* Order Summary */}
                            <div className="px-6 pb-4">
                                <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full ${selectedOrder.customer.color} flex items-center justify-center font-bold text-sm`}>
                                            {selectedOrder.customer.initial}
                                        </div>
                                        <span className="font-medium text-gray-700">{selectedOrder.customer.name}</span>
                                    </div>
                                    <span className="font-serif font-bold text-[#7A1A1A]">₹{selectedOrder.amount.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setCancelOrderOpen(false)}
                                    className="px-6 py-2.5 text-gray-600 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={() => {
                                        // Cancel the order - remove from list
                                        setOrders(orders.filter(o => o.id !== selectedOrder.id));
                                        setCancelOrderOpen(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="px-6 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all"
                                >
                                    Cancel Order
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
