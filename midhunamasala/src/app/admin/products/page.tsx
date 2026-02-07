'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutGrid, ShoppingBag, ShoppingCart, Package,
    BarChart3, Settings, LogOut, Plus, Search, Filter,
    Leaf, MoreVertical, Edit2, Trash2, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

// Navigation Items Configuration
const NAV_ITEMS = [
    { name: 'Garden View', icon: LayoutGrid, href: '/admin' },
    { name: 'Spice Catalog', icon: ShoppingBag, href: '/admin/products', active: true },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders', badge: 5 },
    { name: 'Inventory', icon: Package, href: '/admin/inventory', notification: true },
    { name: 'Sales Growth', icon: BarChart3, href: '/admin/reports' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

// Category Filters
const CATEGORIES = ['All Spices', 'Ground Spices', 'Whole Spices', 'Signature Blends'];

// Mock Product Data
const PRODUCTS = [
    {
        id: 1,
        name: 'Kashmiri Chilli Powder',
        category: 'GROUND SPICES',
        price: 450,
        stock: 124,
        packSize: '500g',
        image: '/products/kashmiri-chilli.jpg',
        inStock: true
    },
    {
        id: 2,
        name: 'Wayanad Turmeric Root',
        category: 'WHOLE SPICES',
        price: 320,
        stock: 15,
        packSize: '1kg',
        image: '/products/turmeric-root.jpg',
        inStock: true,
        lowStock: true
    },
    {
        id: 3,
        name: 'Royal Garam Masala',
        category: 'SIGNATURE BLENDS',
        price: 650,
        stock: 0,
        packSize: '250g',
        image: '/products/garam-masala.jpg',
        inStock: false
    },
    {
        id: 4,
        name: 'Coriander Powder',
        category: 'GROUND SPICES',
        price: 280,
        stock: 200,
        packSize: '500g',
        image: '/products/coriander.jpg',
        inStock: true
    },
    {
        id: 5,
        name: 'Malabar Black Pepper',
        category: 'WHOLE SPICES',
        price: 890,
        stock: 45,
        packSize: '250g',
        image: '/products/black-pepper.jpg',
        inStock: true
    },
    {
        id: 6,
        name: 'Star Anise Premium',
        category: 'WHOLE SPICES',
        price: 1200,
        stock: 8,
        packSize: '100g',
        image: '/products/star-anise.jpg',
        inStock: true,
        lowStock: true
    },
];

export default function SpiceCatalogPage() {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All Spices');
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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

    const filteredProducts = PRODUCTS.filter(product => {
        const matchesCategory = activeCategory === 'All Spices' ||
            product.category.toLowerCase().includes(activeCategory.toLowerCase().replace(' spices', '').replace(' blends', ''));
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
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

            {/* 3. MAIN CONTENT */}
            <main className="p-6 max-w-[1600px] mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-[#7A1A1A]">Spice Catalog</h2>
                        <p className="text-gray-500 mt-1">Manage your premium product offerings</p>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7A1A1A]/20 hover:bg-[#601010] transition-all hover:-translate-y-0.5">
                        <Plus className="w-4 h-4" />
                        Add New Spice
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-1 bg-white rounded-xl p-1.5 border border-[#F3EFEA] shadow-sm">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === category
                                    ? 'bg-[#7A1A1A] text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search catalog..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-[#7A1A1A] text-white placeholder-white/60 rounded-xl text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />
                        </div>
                        <button className="p-2.5 bg-white border border-[#E5D2C5] rounded-xl text-gray-600 hover:border-[#7A1A1A] transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl border border-[#F3EFEA] overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                            >
                                {/* Image */}
                                <div className="relative h-48 bg-gradient-to-br from-[#F5E9DB] to-[#E8DED0] overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-[#8B1E1E]/20">
                                        <Leaf className="w-20 h-20" />
                                    </div>

                                    {/* Out of Stock Badge */}
                                    {!product.inStock && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="bg-[#7A1A1A] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}

                                    {/* Menu Button */}
                                    <div className="absolute top-3 right-3">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                                            className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                                        >
                                            <MoreVertical className="w-4 h-4 text-gray-600" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {openMenuId === product.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    className="absolute top-10 right-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[140px] z-10"
                                                >
                                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                        <Eye className="w-4 h-4" /> View
                                                    </button>
                                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                        <Edit2 className="w-4 h-4" /> Edit
                                                    </button>
                                                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Featured badge for low stock */}
                                    {product.lowStock && (
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F6C84C] text-[#7A1A1A] text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                                ⚡ Low Stock
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Title & Price */}
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-serif font-bold text-[#7A1A1A] leading-tight">{product.name}</h3>
                                        <span className="text-[#D4AF37] font-serif font-bold text-lg tabular-nums lining-nums">₹{product.price}</span>
                                    </div>

                                    {/* Category */}
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">{product.category}</p>

                                    {/* Stock & Pack Size */}
                                    <div className="flex items-center justify-between pt-3 border-t border-[#F3EFEA]">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock</p>
                                            <p className={`text-sm font-bold tabular-nums lining-nums ${product.stock === 0 ? 'text-red-500' : product.lowStock ? 'text-orange-500' : 'text-[#7A1A1A]'}`}>
                                                {product.stock} Units
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pack Size</p>
                                            <p className="text-sm font-bold text-[#7A1A1A]">{product.packSize}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Add New Product Card */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: filteredProducts.length * 0.05 }}
                        className="bg-white rounded-2xl border-2 border-dashed border-[#E5D2C5] hover:border-[#7A1A1A] overflow-hidden min-h-[320px] flex flex-col items-center justify-center gap-3 transition-all group hover:bg-[#FDFBF7]"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-[#7A1A1A]/10 flex items-center justify-center transition-colors">
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#7A1A1A] transition-colors" />
                        </div>
                        <span className="text-gray-500 group-hover:text-[#7A1A1A] font-medium transition-colors">Add New Product</span>
                    </motion.button>
                </div>

            </main>
        </div>
    );
}
