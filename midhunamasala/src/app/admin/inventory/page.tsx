'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    Search, Calendar, Leaf, Package,
    AlertTriangle, RefreshCw, X, Plus, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminNavbar from '@/components/admin/AdminNavbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


// Stock Filters
const STOCK_FILTERS = ['All Stock', 'Expiring Soon', 'Low Stock'];

type InventoryItem = {
    id: string;
    name: string;
    category: string;
    slug: string;
    imageUrl?: string | null;
    stockQty: number;
    lowStockThreshold: number;
    inStock: boolean;
};

export default function InventoryPage() {
    const { user, isAdmin, isLoading: authLoading, getIdToken } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All Stock');
    const [searchQuery, setSearchQuery] = useState('');
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState(false);
    const [inventoryError, setInventoryError] = useState<string | null>(null);

    const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
    const [restockQty, setRestockQty] = useState(0);
    const [isRestocking, setIsRestocking] = useState(false);

    useEffect(() => {
        if (authLoading || !isAdmin) return;

        let cancelled = false;
        const load = async () => {
            setInventoryLoading(true);
            setInventoryError(null);
            try {
                const token = await getIdToken();
                if (!token) {
                    setInventoryError('Please sign in again.');
                    return;
                }

                const response = await fetch(`${API_URL}/api/inventory`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json().catch(() => null);
                if (!response.ok || !data?.success) {
                    if (!cancelled) setInventoryError(data?.error || 'Failed to load inventory.');
                    return;
                }

                const items = Array.isArray(data.items) ? data.items : [];
                if (!cancelled) {
                    setInventory(items.map((it: any) => ({
                        id: String(it.id),
                        name: String(it.name || ''),
                        category: String(it.category || ''),
                        slug: String(it.slug || ''),
                        imageUrl: it.imageUrl ?? null,
                        stockQty: Number(it.stockQty || 0),
                        lowStockThreshold: Number(it.lowStockThreshold || 5),
                        inStock: Boolean(it.inStock),
                    })));
                }
            } catch (e) {
                console.error('Load inventory failed:', e);
                if (!cancelled) setInventoryError('Failed to load inventory.');
            } finally {
                if (!cancelled) setInventoryLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [authLoading, isAdmin, getIdToken]);

    // Auth Check
    useEffect(() => {
        if (!authLoading && !isAdmin && !isLoggingOut) router.replace('/admin/login');
    }, [authLoading, isAdmin, router, isLoggingOut]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await signOut(auth);
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    const getStockStatus = (stockQty: number, lowStockThreshold: number) => {
        if (stockQty <= 0) return 'Out of Stock';
        if (stockQty <= Math.max(1, lowStockThreshold)) return 'Low Stock';
        return 'In Stock';
    };

    const filteredInventory = inventory.filter(item => {
        const status = getStockStatus(item.stockQty, item.lowStockThreshold);
        let matchesFilter = true;
        if (activeFilter === 'Low Stock') {
            matchesFilter = status === 'Low Stock' || status === 'Out of Stock';
        } else if (activeFilter === 'Expiring Soon') {
            // Expiry tracking not implemented in DB yet.
            matchesFilter = true;
        }
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.slug.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalProducts = inventory.length;
    const lowStockCount = inventory.filter(item => {
        const s = getStockStatus(item.stockQty, item.lowStockThreshold);
        return s === 'Low Stock' || s === 'Out of Stock';
    }).length;

    const handleOpenRestock = (item: InventoryItem) => {
        setRestockItem(item);
        setRestockQty(0);
    };

    const handleConfirmRestock = async () => {
        if (!restockItem || restockQty <= 0 || isRestocking) return;
        setIsRestocking(true);
        try {
            const token = await getIdToken();
            if (!token) return;

            const response = await fetch(`${API_URL}/api/inventory/${restockItem.id}/adjust`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    deltaQty: restockQty,
                    reason: 'Admin restock',
                }),
            });
            const data = await response.json().catch(() => null);
            if (!response.ok || !data?.success) {
                alert(data?.error || 'Restock failed.');
                return;
            }

            const newStockQty = Number(data?.result?.stockQty);
            setInventory(prev => prev.map(item =>
                item.id === restockItem.id
                    ? { ...item, stockQty: Number.isFinite(newStockQty) ? newStockQty : item.stockQty }
                    : item
            ));

            setRestockItem(null);
            setRestockQty(0);
        } catch (e) {
            console.error('Restock failed:', e);
            alert('Restock failed.');
        } finally {
            setIsRestocking(false);
        }
    };

    const getStockBarColor = (stockQty: number, lowStockThreshold: number) => {
        if (stockQty <= 0) return 'bg-red-500';
        if (stockQty <= Math.max(1, lowStockThreshold)) return 'bg-red-400';
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

            <AdminNavbar user={user} onLogout={handleLogout} />

            {/* 3. MAIN CONTENT */}
            <main className="p-6 max-w-[1600px] mx-auto space-y-6">

                {/* Header with Stats */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-[#7A1A1A]">Inventory & Stock</h2>
                        <p className="text-gray-500 mt-1">Monitor stock levels and product availability</p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Total Products */}
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Products</p>
                            <p className="text-2xl font-serif font-bold text-[#7A1A1A] tabular-nums lining-nums">{totalProducts}</p>
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
                    <div className="relative flex-1 max-w-lg group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200">
                            <Search className="w-[18px] h-[18px] text-gray-300 group-focus-within:text-[#7A1A1A]" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-20 py-3 bg-white text-gray-800 placeholder-gray-400 rounded-xl text-sm border-2 border-[#F3EFEA] focus:outline-none focus:border-[#7A1A1A] focus:shadow-lg focus:shadow-[#7A1A1A]/5 transition-all duration-200"
                        />
                        {searchQuery ? (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 border border-gray-200">
                                <span className="text-[10px] font-medium text-gray-400">Ctrl K</span>
                            </div>
                        )}
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
                        <div className="col-span-4">Product Details</div>
                        <div className="col-span-3">Stock Level</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Expiry Date</div>
                        <div className="col-span-1 text-right">Action</div>
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
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5E9DB] to-[#E8DED0] flex items-center justify-center text-[#8B1E1E]/30 overflow-hidden">
                                            <Leaf className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-serif font-bold text-[#7A1A1A]">{item.name}</p>
                                            <p className="text-xs text-gray-400">{item.category}</p>
                                        </div>
                                    </div>

                                    {/* Stock Level */}
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${getStockBarColor(item.stockQty, item.lowStockThreshold)}`}
                                                    style={{ width: `${Math.min(100, item.stockQty > 0 ? 100 : 0)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 tabular-nums lining-nums w-16 text-right">{item.stockQty}</span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2">
                                        {(() => {
                                            const status = getStockStatus(item.stockQty, item.lowStockThreshold);
                                            if (status === 'In Stock') return (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-200">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                    In Stock
                                                </span>
                                            );
                                            if (status === 'Out of Stock') return (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full border border-gray-300">
                                                    <Package className="w-3 h-3" />
                                                    Out of Stock
                                                </span>
                                            );
                                            return (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-200">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Low Stock
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    {/* Expiry Date */}
                                    <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        —
                                    </div>

                                    {/* Action */}
                                    <div className="col-span-1 text-right">
                                        <button
                                            onClick={() => handleOpenRestock(item)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[#7A1A1A] hover:bg-[#7A1A1A] hover:text-white text-xs font-medium rounded-lg border border-[#E5D2C5] hover:border-[#7A1A1A] transition-colors"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            Restock
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {inventoryLoading && (
                        <div className="px-6 py-12 text-center">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Loading inventory...</p>
                        </div>
                    )}

                    {!inventoryLoading && inventoryError && (
                        <div className="px-6 py-12 text-center">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-red-600 font-semibold">{inventoryError}</p>
                        </div>
                    )}

                    {!inventoryLoading && !inventoryError && filteredInventory.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No inventory items found</p>
                        </div>
                    )}
                </div>

            </main>

            {/* Restock Modal */}
            <AnimatePresence>
                {restockItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setRestockItem(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-[#7A1A1A] to-[#5A1010] px-6 py-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-serif font-bold text-white">Restock Product</h3>
                                    <p className="text-[11px] text-white/60 mt-0.5">Add inventory for this product</p>
                                </div>
                                <button
                                    onClick={() => setRestockItem(null)}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-5">
                                {/* Product Info */}
                                <div className="flex items-center gap-3 p-3 bg-[#FDFBF7] rounded-xl border border-[#F3EFEA]">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5E9DB] to-[#E8DED0] flex items-center justify-center text-[#8B1E1E]/30">
                                        <Leaf className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-serif font-bold text-[#7A1A1A]">{restockItem.name}</p>
                                        <p className="text-xs text-gray-400">{restockItem.slug} · {restockItem.category}</p>
                                    </div>
                                </div>

                                {/* Current Stock Info */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Stock</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{restockItem.stockQty}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Low Stock Threshold</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{restockItem.lowStockThreshold}</p>
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Restock Quantity</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setRestockQty(q => Math.max(0, q - 10))}
                                            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        >
                                            <Minus className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <input
                                            type="number"
                                            value={restockQty}
                                            onChange={(e) => {
                                                const val = Math.max(0, Math.min(100000, parseInt(e.target.value) || 0));
                                                setRestockQty(val);
                                            }}
                                            className="flex-1 text-center text-2xl font-bold text-[#7A1A1A] py-2 border-2 border-[#F3EFEA] rounded-xl focus:outline-none focus:border-[#7A1A1A] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            onClick={() => setRestockQty(q => Math.min(100000, q + 10))}
                                            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        >
                                            <Plus className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-center">This restock updates stock in the database.</p>
                                </div>

                                {/* New Stock Preview */}
                                {restockQty > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-3 bg-green-50 rounded-xl border border-green-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-green-700">New Stock After Restock</p>
                                            <p className="text-lg font-bold text-green-700">{restockItem.stockQty + restockQty}</p>
                                        </div>
                                        <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full transition-all"
                                                style={{ width: `100%` }}
                                            ></div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-[#F3EFEA] flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setRestockItem(null)}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmRestock}
                                    disabled={restockQty <= 0 || isRestocking}
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#7A1A1A] hover:bg-[#5A1010] rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#7A1A1A]/20"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    {isRestocking ? 'Restocking...' : 'Confirm Restock'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
