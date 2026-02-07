'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutGrid, ShoppingBag, ShoppingCart, Package,
    BarChart3, Settings, LogOut, Search, Calendar, Truck,
    Leaf, AlertTriangle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

// Navigation Items Configuration
const NAV_ITEMS = [
    { name: 'Garden View', icon: LayoutGrid, href: '/admin' },
    { name: 'Spice Catalog', icon: ShoppingBag, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders', badge: 5 },
    { name: 'Inventory', icon: Package, href: '/admin/inventory', active: true, notification: true },
    { name: 'Sales Growth', icon: BarChart3, href: '/admin/reports' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

// Stock Filters
const STOCK_FILTERS = ['All Stock', 'Expiring Soon', 'Low Stock'];

// Mock Inventory Data
const INVENTORY = [
    {
        id: 1,
        name: 'Kashmiri Chilli Powder',
        category: 'Ground Spices',
        sku: 'SP-001',
        batch: 'BATCH-2023-OCT-1',
        stock: 124,
        maxStock: 150,
        status: 'In Stock',
        expiryDate: '2024-08-15',
        supplier: 'Kerala Farms Co.',
        image: '/products/kashmiri-chilli.jpg'
    },
    {
        id: 2,
        name: 'Wayanad Turmeric Root',
        category: 'Whole Spices',
        sku: 'SP-002',
        batch: 'BATCH-2023-OCT-2',
        stock: 15,
        maxStock: 100,
        status: 'Low Stock',
        expiryDate: '2024-12-01',
        supplier: 'Kerala Farms Co.',
        image: '/products/turmeric-root.jpg'
    },
    {
        id: 3,
        name: 'Royal Garam Masala',
        category: 'Signature Blends',
        sku: 'SP-003',
        batch: 'BATCH-2023-OCT-3',
        stock: 0,
        maxStock: 80,
        status: 'Low Stock',
        expiryDate: '2024-06-20',
        supplier: 'Kerala Farms Co.',
        image: '/products/garam-masala.jpg'
    },
    {
        id: 4,
        name: 'Coriander Powder',
        category: 'Ground Spices',
        sku: 'SP-004',
        batch: 'BATCH-2023-OCT-4',
        stock: 200,
        maxStock: 200,
        status: 'In Stock',
        expiryDate: '2024-09-10',
        supplier: 'Kerala Farms Co.',
        image: '/products/coriander.jpg'
    },
    {
        id: 5,
        name: 'Malabar Black Pepper',
        category: 'Whole Spices',
        sku: 'SP-005',
        batch: 'BATCH-2023-OCT-5',
        stock: 45,
        maxStock: 100,
        status: 'In Stock',
        expiryDate: '2025-01-15',
        supplier: 'Kerala Farms Co.',
        image: '/products/black-pepper.jpg'
    },
    {
        id: 6,
        name: 'Star Anise Premium',
        category: 'Whole Spices',
        sku: 'SP-006',
        batch: 'BATCH-2023-OCT-6',
        stock: 8,
        maxStock: 50,
        status: 'Low Stock',
        expiryDate: '2024-11-30',
        supplier: 'Kerala Farms Co.',
        image: '/products/star-anise.jpg'
    },
];

export default function InventoryPage() {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All Stock');
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredInventory = INVENTORY.filter(item => {
        let matchesFilter = true;
        if (activeFilter === 'Low Stock') {
            matchesFilter = item.status === 'Low Stock';
        } else if (activeFilter === 'Expiring Soon') {
            const expiryDate = new Date(item.expiryDate);
            const threeMonthsFromNow = new Date();
            threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
            matchesFilter = expiryDate <= threeMonthsFromNow;
        }
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.batch.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalValue = 1245000;
    const lowStockCount = INVENTORY.filter(item => item.status === 'Low Stock').length;

    const getStockPercentage = (stock: number, maxStock: number) => {
        return Math.round((stock / maxStock) * 100);
    };

    const getStockBarColor = (stock: number, maxStock: number) => {
        const percentage = getStockPercentage(stock, maxStock);
        if (percentage === 0) return 'bg-red-500';
        if (percentage <= 20) return 'bg-red-400';
        if (percentage <= 50) return 'bg-orange-400';
        return 'bg-green-500';
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

                {/* Header with Stats */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-[#7A1A1A]">Inventory & Stock</h2>
                        <p className="text-gray-500 mt-1">Monitor shelf life, batches, and supplier deliveries</p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Total Value */}
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Value</p>
                            <p className="text-2xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">₹{totalValue.toLocaleString('en-IN')}</p>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-12 bg-[#E5D2C5]"></div>

                        {/* Low Stock Alerts */}
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Low Stock Alerts</p>
                            <p className="text-2xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">{lowStockCount} <span className="text-base font-sans text-red-500">Items</span></p>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by SKU, Batch # or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-[#7A1A1A] text-white placeholder-white/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />
                    </div>

                    {/* Stock Filter Tabs */}
                    <div className="flex items-center gap-1 bg-white rounded-xl p-1.5 border border-[#F3EFEA] shadow-sm">
                        {STOCK_FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === filter
                                    ? 'bg-[#7A1A1A] text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-2xl border border-[#F3EFEA] overflow-hidden shadow-sm">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-[#F3EFEA] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <div className="col-span-3">Product Details</div>
                        <div className="col-span-2">SKU / Batch</div>
                        <div className="col-span-2">Stock Level</div>
                        <div>Status</div>
                        <div className="col-span-2">Expiry Date</div>
                        <div>Supplier</div>
                        <div className="text-right">Action</div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-[#F3EFEA]">
                        <AnimatePresence>
                            {filteredInventory.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
                                >
                                    {/* Product Details */}
                                    <div className="col-span-3 flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5E9DB] to-[#E8DED0] flex items-center justify-center text-[#8B1E1E]/30 overflow-hidden">
                                            <Leaf className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-serif font-bold text-[#7A1A1A]">{item.name}</p>
                                            <p className="text-xs text-gray-400">{item.category}</p>
                                        </div>
                                    </div>

                                    {/* SKU / Batch */}
                                    <div className="col-span-2">
                                        <p className="font-medium text-gray-800">{item.sku}</p>
                                        <p className="text-xs text-gray-400">{item.batch}</p>
                                    </div>

                                    {/* Stock Level */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${getStockBarColor(item.stock, item.maxStock)}`}
                                                    style={{ width: `${getStockPercentage(item.stock, item.maxStock)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 tabular-nums lining-nums w-8">{item.stock}</span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        {item.status === 'In Stock' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-200">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-200">
                                                <AlertTriangle className="w-3 h-3" />
                                                Low Stock
                                            </span>
                                        )}
                                    </div>

                                    {/* Expiry Date */}
                                    <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {item.expiryDate}
                                    </div>

                                    {/* Supplier */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Truck className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{item.supplier}</span>
                                    </div>

                                    {/* Action */}
                                    <div className="text-right">
                                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[#7A1A1A] hover:bg-[#7A1A1A] hover:text-white text-xs font-medium rounded-lg border border-[#E5D2C5] hover:border-[#7A1A1A] transition-colors">
                                            <RefreshCw className="w-3 h-3" />
                                            Restock
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredInventory.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No inventory items found</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
