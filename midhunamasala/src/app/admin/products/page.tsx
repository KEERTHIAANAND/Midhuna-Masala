'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutGrid, ShoppingBag, ShoppingCart, Package,
    BarChart3, Settings, LogOut, Plus, Search, Filter,
    Leaf, MoreVertical, Edit2, Trash2, Eye, X, Tag, Hash, Scale, Calendar, ImageIcon
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
const CATEGORIES = ['All Spices', 'Powder', 'Whole Spices', 'Blends'];

// Mock Product Data
const PRODUCTS = [
    {
        id: 1,
        name: 'Kashmiri Chilli Powder',
        subtitle: 'Stone Ground',
        category: 'POWDER',
        stock: 124,
        image: '/products/kashmiri-chilli.jpg',
        inStock: true,
        benefits: ['Rich in antioxidants', 'Vibrant natural color', 'No artificial colors'],
        weightOptions: [{ weight: '100g', price: 150 }, { weight: '250g', price: 320 }, { weight: '500g', price: 450 }]
    },
    {
        id: 2,
        name: 'Wayanad Turmeric Root',
        subtitle: 'Hand Picked',
        category: 'WHOLE SPICES',
        stock: 15,
        image: '/products/turmeric-root.jpg',
        inStock: true,
        lowStock: true,
        benefits: ['High curcumin content', 'Organic certified', 'Anti-inflammatory'],
        weightOptions: [{ weight: '250g', price: 180 }, { weight: '500g', price: 320 }, { weight: '1kg', price: 580 }]
    },
    {
        id: 3,
        name: 'Royal Garam Masala',
        subtitle: 'Traditional Recipe',
        category: 'BLENDS',
        stock: 0,
        image: '/products/garam-masala.jpg',
        inStock: false,
        benefits: ['12 premium spices', 'Family recipe', 'No preservatives'],
        weightOptions: [{ weight: '50g', price: 180 }, { weight: '100g', price: 320 }, { weight: '250g', price: 650 }]
    },
    {
        id: 4,
        name: 'Coriander Powder',
        subtitle: 'Stone Ground',
        category: 'POWDER',
        stock: 200,
        image: '/products/coriander.jpg',
        inStock: true,
        benefits: ['Fresh aroma', 'Digestive aid', '100% pure'],
        weightOptions: [{ weight: '100g', price: 80 }, { weight: '250g', price: 160 }, { weight: '500g', price: 280 }]
    },
    {
        id: 5,
        name: 'Malabar Black Pepper',
        subtitle: 'Premium Quality',
        category: 'WHOLE SPICES',
        stock: 45,
        image: '/products/black-pepper.jpg',
        inStock: true,
        benefits: ['Bold flavor', 'Hand sorted', 'High piperine'],
        weightOptions: [{ weight: '50g', price: 120 }, { weight: '100g', price: 220 }, { weight: '250g', price: 490 }]
    },
    {
        id: 6,
        name: 'Star Anise Premium',
        subtitle: 'Hand Picked',
        category: 'WHOLE SPICES',
        stock: 8,
        image: '/products/star-anise.jpg',
        inStock: true,
        lowStock: true,
        benefits: ['Aromatic flavor', 'Perfect shape', 'Premium grade'],
        weightOptions: [{ weight: '25g', price: 150 }, { weight: '50g', price: 280 }, { weight: '100g', price: 520 }]
    },
];

export default function SpiceCatalogPage() {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All Spices');
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        subtitle: 'Stone Ground',
        imageUrl: '',
        category: 'Powder',
        stockQty: ''
    });
    const [benefits, setBenefits] = useState<string[]>(['']);
    const [weightOptions, setWeightOptions] = useState<{ weight: string, price: string }[]>([{ weight: '', price: '' }]);

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
            product.category.toLowerCase() === activeCategory.toLowerCase();
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

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7A1A1A]/20 hover:bg-[#601010] transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Spice
                    </button>
                </div>

                {/* Add New Spice Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="p-6 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold text-[#7A1A1A]">Add New Spice</h3>
                                            <p className="text-gray-500 text-sm mt-1">Fill in the details for your catalog item.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="px-6 pb-6 space-y-5 max-h-[60vh] overflow-y-auto">
                                    {/* Category & Subtitle Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Category */}
                                        <div>
                                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                <Tag className="w-3 h-3" />
                                                Category
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A] cursor-pointer"
                                            >
                                                <option>Powder</option>
                                                <option>Whole Spices</option>
                                                <option>Blends</option>
                                                <option>Herbs</option>
                                                <option>Masala</option>
                                            </select>
                                        </div>

                                        {/* Subtitle */}
                                        <div>
                                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                <Tag className="w-3 h-3" />
                                                Subtitle
                                            </label>
                                            <select
                                                value={formData.subtitle}
                                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A] cursor-pointer"
                                            >
                                                <option>Stone Ground</option>
                                                <option>Hand Picked</option>
                                                <option>Traditional Recipe</option>
                                                <option>Premium Quality</option>
                                                <option>Organic</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Product Name */}
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            <Tag className="w-3 h-3" />
                                            Product Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Erode Turmeric Powder (Manjal)"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A]"
                                        />
                                    </div>

                                    {/* Image URL */}
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            <ImageIcon className="w-3 h-3" />
                                            Product Image URL
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                placeholder="https://example.com/product-image.jpg"
                                                value={formData.imageUrl}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, imageUrl: e.target.value });
                                                    setImagePreview(e.target.value);
                                                }}
                                                className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A]"
                                            />
                                            {imagePreview && (
                                                <div className="relative group">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={() => setImagePreview('')}
                                                        />
                                                    </div>
                                                    {/* Hover Preview */}
                                                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                                                        <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-white shadow-2xl">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview Large"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Benefits Section */}
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            <Leaf className="w-3 h-3" />
                                            Benefits
                                        </label>
                                        <div className="space-y-2">
                                            {benefits.map((benefit, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span className="text-[#D4AF37]">✦</span>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Rich in antioxidants & natural oils"
                                                        value={benefit}
                                                        onChange={(e) => {
                                                            const newBenefits = [...benefits];
                                                            newBenefits[index] = e.target.value;
                                                            setBenefits(newBenefits);
                                                        }}
                                                        className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A]"
                                                    />
                                                    {benefits.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setBenefits(benefits.filter((_, i) => i !== index))}
                                                            className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setBenefits([...benefits, ''])}
                                                className="flex items-center gap-2 text-sm text-[#7A1A1A] hover:text-[#601010] font-medium mt-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Benefit
                                            </button>
                                        </div>
                                    </div>

                                    {/* Weight Options with Prices */}
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            <Scale className="w-3 h-3" />
                                            Weight Options & Prices
                                        </label>
                                        <div className="space-y-2">
                                            {weightOptions.map((option, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 100g"
                                                        value={option.weight}
                                                        onChange={(e) => {
                                                            const newOptions = [...weightOptions];
                                                            newOptions[index].weight = e.target.value;
                                                            setWeightOptions(newOptions);
                                                        }}
                                                        className="w-24 px-3 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A]"
                                                    />
                                                    <div className="flex items-center flex-1 bg-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                                                        <span className="px-3 text-gray-500 text-sm">₹</span>
                                                        <input
                                                            type="number"
                                                            placeholder="0.00"
                                                            value={option.price}
                                                            onChange={(e) => {
                                                                const newOptions = [...weightOptions];
                                                                newOptions[index].price = e.target.value;
                                                                setWeightOptions(newOptions);
                                                            }}
                                                            className="flex-1 px-2 py-2.5 bg-transparent text-gray-700 placeholder-gray-400 text-sm focus:outline-none"
                                                        />
                                                    </div>
                                                    {weightOptions.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setWeightOptions(weightOptions.filter((_, i) => i !== index))}
                                                            className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setWeightOptions([...weightOptions, { weight: '', price: '' }])}
                                                className="flex items-center gap-2 text-sm text-[#7A1A1A] hover:text-[#601010] font-medium mt-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Weight Option
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stock Quantity */}
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            <Hash className="w-3 h-3" />
                                            Stock Quantity (Total Units)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 100"
                                            value={formData.stockQty}
                                            onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A]"
                                        />
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
                                    <button
                                        onClick={() => {
                                            // Handle form submission here
                                            console.log('Form Data:', formData, 'Benefits:', benefits, 'Weight Options:', weightOptions);
                                            setIsModalOpen(false);
                                            setFormData({
                                                name: '',
                                                subtitle: 'Stone Ground',
                                                imageUrl: '',
                                                category: 'Powder',
                                                stockQty: ''
                                            });
                                            setBenefits(['']);
                                            setWeightOptions([{ weight: '', price: '' }]);
                                            setImagePreview('');
                                        }}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7A1A1A]/20 hover:bg-[#601010] transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Product
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* View Product Modal */}
                <AnimatePresence>
                    {viewModalOpen && selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setViewModalOpen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                            >
                                {/* Modal Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <div>
                                        <h2 className="text-xl font-serif font-bold text-[#7A1A1A]">Product Details</h2>
                                        <p className="text-sm text-gray-500">View complete product information</p>
                                    </div>
                                    <button
                                        onClick={() => setViewModalOpen(false)}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">
                                    {/* Category & Subtitle */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white bg-[#7A1A1A] px-3 py-1 rounded-full uppercase">
                                            {selectedProduct.category}
                                        </span>
                                        <span className="text-xs text-gray-500 italic">{selectedProduct.subtitle}</span>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-2xl font-serif font-bold text-[#7A1A1A]">{selectedProduct.name}</h3>

                                    {/* Benefits */}
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Benefits</p>
                                        <div className="space-y-1">
                                            {selectedProduct.benefits.map((benefit, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <span className="text-[#D4AF37]">✦</span>
                                                    {benefit}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Weight Options */}
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Weight Options & Prices</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedProduct.weightOptions.map((opt, idx) => (
                                                <div key={idx} className="bg-[#F5E9DB] rounded-lg p-3 text-center">
                                                    <p className="text-sm font-bold text-[#7A1A1A]">{opt.weight}</p>
                                                    <p className="text-lg font-serif font-bold text-[#D4AF37]">₹{opt.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stock */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock</p>
                                            <p className={`text-lg font-bold ${selectedProduct.stock === 0 ? 'text-red-500' : selectedProduct.lowStock ? 'text-orange-500' : 'text-[#7A1A1A]'}`}>
                                                {selectedProduct.stock} Units
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                                            <span className={`text-sm font-bold ${selectedProduct.inStock ? 'text-green-600' : 'text-red-500'}`}>
                                                {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setViewModalOpen(false);
                                            setEditModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-[#7A1A1A] border border-[#7A1A1A] rounded-xl text-sm font-bold hover:bg-[#7A1A1A]/5 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Product
                                    </button>
                                    <button
                                        onClick={() => setViewModalOpen(false)}
                                        className="px-6 py-2 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold hover:bg-[#601010] transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {deleteConfirmOpen && selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setDeleteConfirmOpen(false)}
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
                                        <Trash2 className="w-8 h-8 text-red-500" />
                                    </div>
                                    <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Delete Product?</h2>
                                    <p className="text-gray-500">
                                        Are you sure you want to delete <span className="font-bold text-[#7A1A1A]">{selectedProduct.name}</span>?
                                        This action cannot be undone.
                                    </p>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setDeleteConfirmOpen(false)}
                                        className="px-6 py-2.5 text-gray-600 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Handle delete here
                                            console.log('Deleting product:', selectedProduct.id);
                                            setDeleteConfirmOpen(false);
                                            setSelectedProduct(null);
                                        }}
                                        className="px-6 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all"
                                    >
                                        Delete Product
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Product Modal */}
                <AnimatePresence>
                    {editModalOpen && selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setEditModalOpen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                            >
                                {/* Modal Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <div>
                                        <h2 className="text-xl font-serif font-bold text-[#7A1A1A]">Edit Product</h2>
                                        <p className="text-sm text-gray-500">Update product information</p>
                                    </div>
                                    <button
                                        onClick={() => setEditModalOpen(false)}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">
                                    <p className="text-sm text-gray-500 text-center py-8">
                                        Edit functionality will be implemented with backend integration.
                                        <br />
                                        <span className="text-[#7A1A1A] font-medium">Currently editing: {selectedProduct.name}</span>
                                    </p>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => setEditModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log('Saving product:', selectedProduct.id);
                                            setEditModalOpen(false);
                                        }}
                                        className="px-6 py-2 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold hover:bg-[#601010] transition-all"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search catalog..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 text-gray-700 placeholder-gray-400 rounded-xl text-sm w-72 focus:outline-none focus:border-[#7A1A1A] focus:ring-1 focus:ring-[#7A1A1A]/20"
                        />
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
                                {/* Image - Clickable */}
                                <div
                                    className="relative h-48 bg-gradient-to-br from-[#F5E9DB] to-[#E8DED0] overflow-hidden cursor-pointer"
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setViewModalOpen(true);
                                    }}
                                >
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

                                    {/* Featured badge for low stock */}
                                    {product.lowStock && (
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F6C84C] text-[#7A1A1A] text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                                ⚡ Low Stock
                                            </span>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-[#7A1A1A]/0 group-hover:bg-[#7A1A1A]/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-white/90 text-[#7A1A1A] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                            View Details
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Category Badge */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold text-[#7A1A1A] bg-[#7A1A1A]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Title & Price */}
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <h3 className="font-serif font-bold text-[#7A1A1A] leading-tight">{product.name}</h3>
                                            <p className="text-xs text-gray-500 italic">{product.subtitle}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[#D4AF37] font-serif font-bold text-lg tabular-nums lining-nums">
                                                ₹{product.weightOptions[0]?.price}
                                            </span>
                                            <p className="text-[10px] text-gray-400">onwards</p>
                                        </div>
                                    </div>

                                    {/* Benefits Preview */}
                                    <div className="mb-3">
                                        <div className="flex flex-wrap gap-1">
                                            {product.benefits.slice(0, 2).map((benefit, idx) => (
                                                <span key={idx} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                    ✦ {benefit}
                                                </span>
                                            ))}
                                            {product.benefits.length > 2 && (
                                                <span className="text-[10px] text-[#7A1A1A] font-medium">+{product.benefits.length - 2} more</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Weight Options & Stock */}
                                    <div className="pt-3 border-t border-[#F3EFEA]">
                                        {/* Weight Options */}
                                        <div className="mb-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Weights</p>
                                            <div className="flex flex-wrap gap-1">
                                                {product.weightOptions.map((opt, idx) => (
                                                    <span key={idx} className="text-[10px] bg-[#F5E9DB] text-[#7A1A1A] px-2 py-0.5 rounded font-medium">
                                                        {opt.weight}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Stock */}
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock</p>
                                            <p className={`text-sm font-bold tabular-nums lining-nums ${product.stock === 0 ? 'text-red-500' : product.lowStock ? 'text-orange-500' : 'text-[#7A1A1A]'}`}>
                                                {product.stock} Units
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </main>
        </div>
    );
}
