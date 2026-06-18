'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, ShoppingCart, LogOut, Loader2, Package,
    MapPin, Phone, Edit2, Settings, ChevronRight, Star,
    Shield, Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { clientEnv } from '@/lib/env';

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

type MyOrder = {
    id: string;
    orderNumber: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    total: number;
    createdAt: string;
    itemCount?: number;
};

type OrderDetailItem = {
    id: string;
    name: string;
    weight?: string;
    price: number;
    quantity: number;
};

type Address = {
    id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
};

const EMPTY_ADDRESS: Address = {
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
};

function AddressManager({ getIdToken, user }: { getIdToken: () => Promise<string | null>, user: any }) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Address>(EMPTY_ADDRESS);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        setLoading(true);
        try {
            const token = await getIdToken();
            if (!token) return;
            const res = await fetch(`${API_URL}/api/addresses`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAddresses(data.addresses || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setError('');
        if (!currentAddress.street || !currentAddress.city || !currentAddress.pincode) {
            setError('Please fill in all required fields (Street, City, Pincode)');
            return;
        }

        setSaving(true);
        try {
            const token = await getIdToken();
            if (!token) return;

            const url = currentAddress.id 
                ? `${API_URL}/api/addresses/${currentAddress.id}` 
                : `${API_URL}/api/addresses`;
            const method = currentAddress.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: currentAddress.firstName || '',
                    lastName: currentAddress.lastName || '',
                    phone: currentAddress.phone || '',
                    street: currentAddress.street,
                    apartment: currentAddress.apartment || '',
                    city: currentAddress.city,
                    state: currentAddress.state,
                    pincode: currentAddress.pincode,
                    isDefault: currentAddress.isDefault || false
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save address');

            await loadAddresses();
            setIsEditing(false);
        } catch (e: any) {
            setError(e.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const token = await getIdToken();
            if (!token) return;
            await fetch(`${API_URL}/api/addresses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await loadAddresses();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="text-sm text-gray-500 flex items-center py-4"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading addresses...</div>;

    if (isEditing) {
        return (
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h4 className="font-bold text-gray-800 mb-4">{currentAddress.id ? 'Edit Address' : 'Add New Address'}</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-[#8B1E1E] text-sm" value={currentAddress.firstName} onChange={e => setCurrentAddress({...currentAddress, firstName: e.target.value})} />
                    <input type="text" placeholder="Last Name" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-[#8B1E1E] text-sm" value={currentAddress.lastName} onChange={e => setCurrentAddress({...currentAddress, lastName: e.target.value})} />
                </div>
                
                <input type="tel" placeholder="Phone Number" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#8B1E1E] text-sm" value={currentAddress.phone} onChange={e => setCurrentAddress({...currentAddress, phone: e.target.value})} />
                <input type="text" placeholder="Street Address *" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#8B1E1E] text-sm" value={currentAddress.street} onChange={e => setCurrentAddress({...currentAddress, street: e.target.value})} />
                <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#8B1E1E] text-sm" value={currentAddress.apartment} onChange={e => setCurrentAddress({...currentAddress, apartment: e.target.value})} />
                
                <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="City *" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-[#8B1E1E] text-sm" value={currentAddress.city} onChange={e => setCurrentAddress({...currentAddress, city: e.target.value})} />
                    <input type="text" placeholder="State" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-[#8B1E1E] text-sm" value={currentAddress.state} onChange={e => setCurrentAddress({...currentAddress, state: e.target.value})} />
                    <input type="text" placeholder="Pincode *" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-[#8B1E1E] text-sm" value={currentAddress.pincode} onChange={e => setCurrentAddress({...currentAddress, pincode: e.target.value})} />
                </div>

                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                
                <div className="flex gap-3 pt-2">
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#8B1E1E] text-white font-bold rounded-xl text-sm flex items-center">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Address
                    </button>
                    <button onClick={() => setIsEditing(false)} disabled={saving} className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-300">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {addresses.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">No saved addresses found.</div>
            ) : (
                addresses.map(addr => (
                    <div key={addr.id} className="p-5 rounded-2xl border border-gray-200 hover:border-[#8B1E1E] transition-all bg-white relative group">
                        <div className="pr-16">
                            <p className="font-bold text-gray-800">{addr.firstName} {addr.lastName}</p>
                            <p className="text-sm text-gray-600 mt-1">{addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
                            <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.pincode}</p>
                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1"><Phone className="w-3 h-3" /> {addr.phone}</p>
                        </div>
                        <div className="absolute top-5 right-5 flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setCurrentAddress(addr); setIsEditing(true); }} className="p-2 text-gray-400 hover:text-[#8B1E1E] bg-gray-50 hover:bg-[#8B1E1E]/10 rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(addr.id!)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                ))
            )}
            
            <button 
                onClick={() => { setCurrentAddress({...EMPTY_ADDRESS, firstName: user?.name?.split(' ')[0] || '', lastName: user?.name?.split(' ').slice(1).join(' ') || '', phone: user?.phone || ''}); setIsEditing(true); }}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-[#8B1E1E] hover:text-[#8B1E1E] hover:bg-[#8B1E1E]/5 transition-all font-bold text-sm flex items-center justify-center gap-2 mt-4"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add New Address
            </button>
        </div>
    );
}

// Tab Configuration
const TABS = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ProfilePage() {
    const { user, logout, getIdToken, updateUser } = useAuth();
    const { cartCount } = useCart();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');

    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneInput, setPhoneInput] = useState('');
    const [isSavingPhone, setIsSavingPhone] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    const [myOrders, setMyOrders] = useState<MyOrder[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersLoaded, setOrdersLoaded] = useState(false);
    const [ordersError, setOrdersError] = useState<string | null>(null);

    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
    const [orderDetails, setOrderDetails] = useState<Record<string, { items: OrderDetailItem[] }>>({});

    useEffect(() => {
        async function loadMyOrders() {
            setOrdersLoading(true);
            setOrdersError(null);
            try {
                const token = await getIdToken();
                if (!token) {
                    setOrdersError('Please sign in again to view orders.');
                    return;
                }

                const response = await fetch(`${API_URL}/api/orders?limit=50&offset=0`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                const data = await response.json().catch(() => null);
                if (!response.ok || !data?.success) {
                    setOrdersError(data?.error || 'Failed to load orders.');
                    return;
                }

                setMyOrders((data.orders || []) as MyOrder[]);
                setOrdersLoaded(true);
            } catch (e) {
                console.error('Load my orders failed:', e);
                setOrdersError('Failed to load orders.');
            } finally {
                setOrdersLoading(false);
            }
        }

        if (activeTab === 'orders' && !ordersLoaded) {
            loadMyOrders();
        }
    }, [activeTab, ordersLoaded, getIdToken]);

    const toggleOrderDetails = async (order: MyOrder) => {
        const nextId = expandedOrderId === order.id ? null : order.id;
        setExpandedOrderId(nextId);
        if (!nextId) return;

        if (orderDetails[nextId]) return;

        setDetailLoadingId(nextId);
        try {
            const token = await getIdToken();
            if (!token) return;

            const response = await fetch(`${API_URL}/api/orders/${order.id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json().catch(() => null);
            if (!response.ok || !data?.success) return;

            const rawItems: unknown = (data as { items?: unknown })?.items;
            const items = (Array.isArray(rawItems) ? rawItems : []).map((it) => {
                const row = (it ?? {}) as Record<string, unknown>;
                return {
                    id: String(row.id ?? ''),
                    name: String(row.name ?? ''),
                    weight: row.weight ? String(row.weight) : undefined,
                    price: Number(row.price ?? 0),
                    quantity: Number(row.quantity ?? 0),
                };
            });

            setOrderDetails(prev => ({ ...prev, [order.id]: { items } }));
        } catch (e) {
            console.error('Load order details failed:', e);
        } finally {
            setDetailLoadingId(null);
        }
    };

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

    const handleSavePhone = async () => {
        setIsSavingPhone(true);
        setPhoneError('');
        try {
            const token = await getIdToken();
            if (!token) throw new Error('Session expired. Please log in again.');

            const response = await fetch(`${API_URL}/api/auth/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: user?.name, phone: phoneInput })
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to update phone number.');
            }

            updateUser({ phone: phoneInput });
            setIsEditingPhone(false);
        } catch (error: any) {
            console.error('Error updating phone:', error);
            setPhoneError(error.message || 'Failed to save changes.');
        } finally {
            setIsSavingPhone(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#8B1E1E]" />
            </div>
        );
    }

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently joined';

    return (
        <div className="min-h-screen bg-[#FFFDF5] relative isolate">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
                style={{ backgroundImage: 'radial-gradient(#8B1E1E 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 animate-in fade-in duration-700">

                {/* Page Title */}
                <div className="mb-6 sm:mb-10 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#8B1E1E] tracking-tight">My Profile</h1>
                    <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-lg">Manage your personal information and orders.</p>
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
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }}></div>
                                {/* Abstract Shine */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            </div>

                            <div className="px-6 pb-8 text-center relative">
                                {/* Avatar - Overlapping Banner */}
                                <div className="-mt-12 sm:-mt-16 mb-4 relative inline-block">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-1.5 shadow-lg mx-auto">
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#F6C84C] to-[#D4AF37] flex items-center justify-center text-[#8B1E1E] text-3xl sm:text-4xl font-bold font-serif shadow-inner">
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
                                        <span className="font-bold text-gray-900">{myOrders.length}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#FFFDF5] border border-transparent hover:border-[#E5D2C5] transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#F6C84C]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#F6C84C] group-hover:text-white transition-colors">
                                                <ShoppingCart className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">Cart Items</span>
                                        </div>
                                        <span className="font-bold text-gray-900">{cartCount}</span>
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
                                className="bg-white rounded-3xl p-4 sm:p-8 shadow-xl shadow-[#8B1E1E]/5 border border-[#E5D2C5] min-h-[300px] sm:min-h-[400px]"
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
                                    <div className="animate-in fade-in duration-500">
                                        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                                            <h2 className="text-2xl font-serif font-bold text-gray-800">My Orders</h2>
                                            <span className="text-sm font-semibold text-gray-500">{myOrders.length} order{myOrders.length === 1 ? '' : 's'}</span>
                                        </div>

                                        {ordersLoading && (
                                            <div className="flex items-center justify-center py-16 text-gray-500">
                                                <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#8B1E1E]" />
                                                Loading your orders...
                                            </div>
                                        )}

                                        {!ordersLoading && ordersError && (
                                            <div className="py-10 text-center">
                                                <p className="text-sm text-red-600 font-semibold">{ordersError}</p>
                                            </div>
                                        )}

                                        {!ordersLoading && !ordersError && myOrders.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                                <div className="w-32 h-32 bg-gradient-to-br from-[#FFFDF5] to-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                                                    <Package className="w-12 h-12 text-gray-300" />
                                                </div>
                                                <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">No Past Orders</h3>
                                                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                                    We&apos;re waiting to spice up your kitchen! Your order history will appear here.
                                                </p>
                                                <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-[#8B1E1E] text-white rounded-xl font-bold hover:bg-[#6B1616] transition-all hover:shadow-lg hover:shadow-[#8B1E1E]/30 transform hover:-translate-y-1">
                                                    <ShoppingCart className="w-5 h-5" />
                                                    Shop Now
                                                </Link>
                                            </div>
                                        )}

                                        {!ordersLoading && !ordersError && myOrders.length > 0 && (
                                            <div className="pt-8 space-y-4">
                                                {myOrders.map((order) => (
                                                    <div
                                                        key={order.id}
                                                        className="rounded-2xl bg-gray-50 border border-gray-100 hover:bg-[#FFFDF5] hover:border-[#E5D2C5] transition-all overflow-hidden"
                                                    >
                                                        <button
                                                            onClick={() => toggleOrderDetails(order)}
                                                            className="w-full p-5 flex items-start justify-between gap-4 text-left"
                                                        >
                                                            <div>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order</p>
                                                                <p className="text-lg font-serif font-bold text-[#8B1E1E]">{order.orderNumber}</p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {new Date(order.createdAt).toLocaleString('en-IN')}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-lg font-bold text-gray-900">₹{Number(order.total || 0).toLocaleString('en-IN')}</p>
                                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{order.status}</p>
                                                                <p className="text-xs text-gray-400 mt-1">Tap to view details</p>
                                                            </div>
                                                        </button>

                                                        {expandedOrderId === order.id && (
                                                            <div className="px-5 pb-5">
                                                                <div className="border-t border-gray-200 pt-4">
                                                                    {detailLoadingId === order.id && (
                                                                        <div className="flex items-center text-sm text-gray-500">
                                                                            <Loader2 className="w-4 h-4 animate-spin mr-2 text-[#8B1E1E]" />
                                                                            Loading order details...
                                                                        </div>
                                                                    )}

                                                                    {detailLoadingId !== order.id && orderDetails[order.id]?.items?.length > 0 && (
                                                                        <div className="space-y-3">
                                                                            {orderDetails[order.id].items.map((it) => (
                                                                                <div key={it.id} className="flex items-start justify-between gap-4">
                                                                                    <div>
                                                                                        <p className="text-sm font-semibold text-gray-800">{it.name}</p>
                                                                                        {it.weight && <p className="text-xs text-gray-500">{it.weight}</p>}
                                                                                        <p className="text-xs text-gray-500">Qty: {it.quantity}</p>
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <p className="text-sm font-semibold text-gray-800">₹{Number(it.price || 0).toLocaleString('en-IN')}</p>
                                                                                        <p className="text-xs text-gray-500">Line: ₹{Number((it.price || 0) * (it.quantity || 0)).toLocaleString('en-IN')}</p>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {detailLoadingId !== order.id && (!orderDetails[order.id] || orderDetails[order.id]?.items?.length === 0) && (
                                                                        <p className="text-sm text-gray-500">No items found for this order.</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
                                                    {isEditingPhone ? (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="tel"
                                                                    value={phoneInput}
                                                                    onChange={(e) => setPhoneInput(e.target.value)}
                                                                    placeholder="Enter phone number"
                                                                    className="flex-1 px-4 py-3 bg-white border border-[#8B1E1E]/30 focus:border-[#8B1E1E] focus:ring-1 focus:ring-[#8B1E1E] rounded-xl outline-none transition-colors text-sm"
                                                                    autoFocus
                                                                />
                                                                <button
                                                                    onClick={handleSavePhone}
                                                                    disabled={isSavingPhone}
                                                                    className="px-4 py-3 bg-[#8B1E1E] text-white rounded-xl text-sm font-bold disabled:opacity-50"
                                                                >
                                                                    {isSavingPhone ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                                                                </button>
                                                                <button
                                                                    onClick={() => setIsEditingPhone(false)}
                                                                    disabled={isSavingPhone}
                                                                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold disabled:opacity-50"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                            {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
                                                        </div>
                                                    ) : (
                                                        <div 
                                                            onClick={() => {
                                                                setPhoneInput(user.phone || '');
                                                                setIsEditingPhone(true);
                                                                setPhoneError('');
                                                            }}
                                                            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#8B1E1E] transition-colors cursor-pointer group"
                                                        >
                                                            <Phone className="w-5 h-5 text-gray-400 group-hover:text-[#8B1E1E] transition-colors" />
                                                            <span className="font-semibold text-gray-700">{user.phone || 'Add phone number'}</span>
                                                            <Edit2 className="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#8B1E1E]" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </section>

                                        {/* Addresses */}
                                        <section className="border-t border-gray-100 pt-8">
                                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-[#8B1E1E]" />
                                                Saved Addresses
                                            </h3>
                                            <AddressManager getIdToken={getIdToken} user={user} />
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
