'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    Plus, Search, Filter, Leaf,
    Edit2, Trash2, Eye, X, Tag, Hash, Scale, Calendar, ImageIcon, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import AdminNavbar from '@/components/admin/AdminNavbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Category Filters
const CATEGORIES = ['All Spices', 'Powder', 'Whole Spices', 'Blends'];

// DB Product type (matches API response)
type Product = {
    id: string;      // slug
    dbId: string;     // UUID from Supabase
    name: string;
    slug: string;
    category: string;
    image: string;
    price: number;
    weight?: string;
    type?: string;
    description?: string;
    rating?: number;
    inStock: boolean;
    isFeatured?: boolean;
};

export default function SpiceCatalogPage() {
    const { user, isAdmin, isLoading: authLoading, getIdToken } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All Spices');
    const [searchQuery, setSearchQuery] = useState('');

    // Product state
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        type: 'Stone Ground',
        imageUrl: '',
        category: 'POWDER',
        description: '',
        price: '',
        weight: '100g',
        inStock: true,
        isFeatured: false,
    });
    const [imagePreview, setImagePreview] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Auth Check
    useEffect(() => {
        if (!authLoading && !isAdmin && !isLoggingOut) router.replace('/admin/login');
    }, [authLoading, isAdmin, router, isLoggingOut]);

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        try {
            setIsLoadingProducts(true);
            const response = await fetch(`${API_URL}/api/products`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setProducts(data.products);
                }
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            showToast('Failed to load products', 'error');
        } finally {
            setIsLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        if (isAdmin) fetchProducts();
    }, [isAdmin, fetchProducts]);

    // Show toast notification
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            type: 'Stone Ground',
            imageUrl: '',
            category: 'POWDER',
            description: '',
            price: '',
            weight: '100g',
            inStock: true,
            isFeatured: false,
        });
        setImagePreview('');
    };

    // Populate form with product data for editing
    const populateForm = (product: Product) => {
        setFormData({
            name: product.name,
            type: product.type || 'Stone Ground',
            imageUrl: product.image || '',
            category: product.category,
            description: product.description || '',
            price: product.price.toString(),
            weight: product.weight || '100g',
            inStock: product.inStock,
            isFeatured: product.isFeatured || false,
        });
        setImagePreview(product.image || '');
    };

    // ─── CREATE PRODUCT ───
    const handleCreateProduct = async () => {
        if (!formData.name || !formData.price) {
            showToast('Name and price are required', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const token = await getIdToken();
            if (!token) {
                showToast('Please sign in again', 'error');
                return;
            }

            const response = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    weight: formData.weight,
                    type: formData.type,
                    description: formData.description,
                    image_url: formData.imageUrl,
                    in_stock: formData.inStock,
                    is_featured: formData.isFeatured,
                }),
            });

            const data = await response.json();

            if (data.success) {
                showToast(`"${formData.name}" added successfully!`, 'success');
                setIsModalOpen(false);
                resetForm();
                fetchProducts(); // Refresh the list
            } else {
                showToast(data.error || 'Failed to create product', 'error');
            }
        } catch (error) {
            console.error('Create product error:', error);
            showToast('Failed to create product', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // ─── UPDATE PRODUCT ───
    const handleUpdateProduct = async () => {
        if (!selectedProduct || !formData.name || !formData.price) {
            showToast('Name and price are required', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const token = await getIdToken();
            if (!token) {
                showToast('Please sign in again', 'error');
                return;
            }

            const response = await fetch(`${API_URL}/api/products/${selectedProduct.dbId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    weight: formData.weight,
                    type: formData.type,
                    description: formData.description,
                    image_url: formData.imageUrl,
                    in_stock: formData.inStock,
                    is_featured: formData.isFeatured,
                }),
            });

            const data = await response.json();

            if (data.success) {
                showToast(`"${formData.name}" updated successfully!`, 'success');
                setEditModalOpen(false);
                setSelectedProduct(null);
                resetForm();
                fetchProducts();
            } else {
                showToast(data.error || 'Failed to update product', 'error');
            }
        } catch (error) {
            console.error('Update product error:', error);
            showToast('Failed to update product', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // ─── DELETE PRODUCT ───
    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;

        setIsDeleting(true);
        try {
            const token = await getIdToken();
            if (!token) {
                showToast('Please sign in again', 'error');
                return;
            }

            const response = await fetch(`${API_URL}/api/products/${selectedProduct.dbId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                showToast(`"${selectedProduct.name}" deleted successfully!`, 'success');
                setDeleteConfirmOpen(false);
                setSelectedProduct(null);
                fetchProducts();
            } else {
                showToast(data.error || 'Failed to delete product', 'error');
            }
        } catch (error) {
            console.error('Delete product error:', error);
            showToast('Failed to delete product', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

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

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'All Spices' ||
            product.category.toLowerCase() === activeCategory.toLowerCase() ||
            (activeCategory === 'Blends' && product.category === 'BLEND');
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

    // ─── Reusable Form Component ───
    const ProductForm = ({ isEdit = false }: { isEdit?: boolean }) => (
        <div className="px-6 pb-6 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Category & Type Row */}
            <div className="grid grid-cols-2 gap-4">
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
                        <option value="POWDER">Powder</option>
                        <option value="WHOLE SPICES">Whole Spices</option>
                        <option value="BLEND">Blends</option>
                    </select>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <Tag className="w-3 h-3" />
                        Type
                    </label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A] cursor-pointer"
                    >
                        <option>Stone Ground</option>
                        <option>Hand Picked</option>
                        <option>Traditional Recipe</option>
                        <option>Seeds & Pods</option>
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

            {/* Description */}
            <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Leaf className="w-3 h-3" />
                    Description
                </label>
                <textarea
                    placeholder="Describe the product..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A] resize-none"
                />
            </div>

            {/* Price & Weight Row */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <Scale className="w-3 h-3" />
                        Price (₹)
                    </label>
                    <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                        <span className="px-3 text-gray-500 text-sm">₹</span>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="flex-1 px-2 py-3 bg-transparent text-gray-700 placeholder-gray-400 text-sm focus:outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <Hash className="w-3 h-3" />
                        Weight
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. 100g"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A]"
                    />
                </div>
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
                        placeholder="/images/products/product.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => {
                            setFormData({ ...formData, imageUrl: e.target.value });
                            setImagePreview(e.target.value);
                        }}
                        className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:border-[#7A1A1A]"
                    />
                    {imagePreview && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={() => setImagePreview('')}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-[#7A1A1A] focus:ring-[#7A1A1A]"
                    />
                    <span className="text-sm text-gray-700 font-medium">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-[#7A1A1A] focus:ring-[#7A1A1A]"
                    />
                    <span className="text-sm text-gray-700 font-medium">Featured</span>
                </label>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800">

            <AdminNavbar user={user} onLogout={handleLogout} />

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        className={`fixed top-4 left-1/2 z-[100] flex items-center gap-2 px-6 py-3 rounded-xl shadow-2xl text-sm font-medium ${toast.type === 'success'
                                ? 'bg-green-600 text-white'
                                : 'bg-red-600 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            <main className="p-6 max-w-[1600px] mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-[#7A1A1A]">Spice Catalog</h2>
                        <p className="text-gray-500 mt-1">
                            Manage your premium product offerings
                            {!isLoadingProducts && <span className="text-[#7A1A1A] font-medium ml-2">({products.length} products)</span>}
                        </p>
                    </div>

                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7A1A1A]/20 hover:bg-[#601010] transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Spice
                    </button>
                </div>

                {/* ═══ ADD NEW PRODUCT MODAL ═══ */}
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

                                <ProductForm />

                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
                                    <button
                                        onClick={handleCreateProduct}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7A1A1A]/20 hover:bg-[#601010] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                                        ) : (
                                            <><Plus className="w-4 h-4" /> Create Product</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ═══ VIEW PRODUCT MODAL ═══ */}
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

                                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white bg-[#7A1A1A] px-3 py-1 rounded-full uppercase">
                                            {selectedProduct.category}
                                        </span>
                                        <span className="text-xs text-gray-500 italic">{selectedProduct.type || 'Stone Ground'}</span>
                                        {selectedProduct.isFeatured && (
                                            <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">⭐ Featured</span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-serif font-bold text-[#7A1A1A]">{selectedProduct.name}</h3>

                                    {selectedProduct.description && (
                                        <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                                    )}

                                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</p>
                                            <p className="text-xl font-serif font-bold text-[#D4AF37]">₹{selectedProduct.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weight</p>
                                            <p className="text-lg font-bold text-[#7A1A1A]">{selectedProduct.weight || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                                            <span className={`text-sm font-bold ${selectedProduct.inStock ? 'text-green-600' : 'text-red-500'}`}>
                                                {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setViewModalOpen(false);
                                            populateForm(selectedProduct);
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

                {/* ═══ DELETE CONFIRMATION MODAL ═══ */}
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
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setDeleteConfirmOpen(false)}
                                        disabled={isDeleting}
                                        className="px-6 py-2.5 text-gray-600 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteProduct}
                                        disabled={isDeleting}
                                        className="px-6 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                                        ) : (
                                            'Delete Product'
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ═══ EDIT PRODUCT MODAL ═══ */}
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
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <div>
                                        <h2 className="text-xl font-serif font-bold text-[#7A1A1A]">Edit Product</h2>
                                        <p className="text-sm text-gray-500">Update {selectedProduct.name}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditModalOpen(false)}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>

                                <ProductForm isEdit />

                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => setEditModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateProduct}
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-[#7A1A1A] text-white rounded-xl text-sm font-bold hover:bg-[#601010] transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSaving ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                {isLoadingProducts ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-[#7A1A1A] mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">Loading products...</p>
                        </div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm font-medium">No products found</p>
                            <p className="text-gray-400 text-xs mt-1">Try changing filters or add a new product</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.dbId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl border border-[#F3EFEA] overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                                >
                                    {/* Image */}
                                    <div
                                        className="relative h-48 bg-gradient-to-br from-[#F5E9DB] to-[#E8DED0] overflow-hidden cursor-pointer"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setViewModalOpen(true);
                                        }}
                                    >
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-4"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[#8B1E1E]/20">
                                                <Leaf className="w-20 h-20" />
                                            </div>
                                        )}

                                        {!product.inStock && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="bg-[#7A1A1A] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}

                                        {product.isFeatured && (
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-gradient-to-r from-[#D4AF37] to-[#F6C84C] text-[#7A1A1A] text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                                    ⭐ Featured
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-[#7A1A1A]/0 group-hover:bg-[#7A1A1A]/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <span className="bg-white/90 text-[#7A1A1A] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                View Details
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold text-[#7A1A1A] bg-[#7A1A1A]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {product.category}
                                            </span>
                                        </div>

                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div>
                                                <h3 className="font-serif font-bold text-[#7A1A1A] leading-tight">{product.name}</h3>
                                                <p className="text-xs text-gray-500 italic">{product.type || 'Stone Ground'}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[#D4AF37] font-serif font-bold text-lg">₹{product.price}</span>
                                                {product.weight && <p className="text-[10px] text-gray-400">{product.weight}</p>}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 pt-3 border-t border-[#F3EFEA]">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    populateForm(product);
                                                    setEditModalOpen(true);
                                                }}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[#7A1A1A] bg-[#7A1A1A]/5 hover:bg-[#7A1A1A]/10 rounded-lg text-xs font-bold transition-all"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setDeleteConfirmOpen(true);
                                                }}
                                                className="flex items-center justify-center gap-1.5 py-2 px-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold transition-all"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

            </main>
        </div>
    );
}
