"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
    CreditCard, ChevronRight, Check,
    Plus, Phone, Home, Briefcase, Pin, Truck, Package,
    Lock, ArrowLeft, Loader2, Smartphone, Landmark, Banknote, ChevronLeft,
} from 'lucide-react';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/* ═══════════════════════════════════════════
   Constants & Types
   ═══════════════════════════════════════════ */

const SERIF = "'Playfair Display', serif";


interface Address {
    id?: string;       // Supabase UUID (undefined for new addresses)
    fullName: string;
    phone: string;
    street: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    label: 'home' | 'work' | 'other';
    isDefault?: boolean;
}

const EMPTY_ADDRESS: Address = {
    fullName: '', phone: '', street: '', landmark: '',
    city: '', state: '', pincode: '', label: 'home',
};

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const CONFETTI_COLORS = ['#8B1E1E', '#D4AF37', '#B8A88A', '#C49A6C', '#A0522D', '#8B6914', '#CD853F', '#DAA520'];

/* ═══════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════ */

const staggerParent: Variants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const staggerChild: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

/* ═══════════════════════════════════════════
   Confetti (Muted, elegant)
   ═══════════════════════════════════════════ */

interface Piece {
    id: number; x: number; delay: number; dur: number;
    drift: number; rot: number; size: number; color: string;
    shape: 'rect' | 'circle' | 'strip';
}

function makeConfetti(n: number): Piece[] {
    return Array.from({ length: n }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2.5 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 120,
        rot: Math.random() * 720 - 360,
        size: 5 + Math.random() * 6,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        shape: (['rect', 'circle', 'strip'] as const)[i % 3],
    }));
}

function Confetti({ active }: { active: boolean }) {
    const [pieces, setPieces] = useState<Piece[]>([]);
    useEffect(() => { setPieces(active ? makeConfetti(50) : []); }, [active]);
    if (!active || !pieces.length) return null;
    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {pieces.map(p => (
                <motion.div key={p.id}
                    initial={{ y: -20, x: `${p.x}vw`, opacity: 0.8, rotate: 0 }}
                    animate={{ y: '110vh', x: `calc(${p.x}vw + ${p.drift}px)`, opacity: [0.8, 0.8, 0.6, 0], rotate: p.rot }}
                    transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
                    style={{
                        position: 'absolute', top: 0,
                        width: p.shape === 'strip' ? p.size * 0.4 : p.size,
                        height: p.shape === 'strip' ? p.size * 2.5 : p.shape === 'rect' ? p.size * 0.6 : p.size,
                        backgroundColor: p.color,
                        borderRadius: p.shape === 'circle' ? '50%' : '1px',
                    }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════
   Refined Sub-components
   ═══════════════════════════════════════════ */

function SectionCard({ title, action, children }: {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base text-[#1A1A1A]" style={{ fontFamily: SERIF, fontWeight: 600 }}>
                    {title}
                </h2>
                {action}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function InputField({ label, value, onChange, error, prefix }: {
    label: string; value: string; onChange: (v: string) => void;
    error?: string; prefix?: string;
}) {
    return (
        <div>
            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
            <div className={`flex items-center rounded-md border transition-colors ${error ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus-within:border-[#8B1E1E]/50'}`}>
                {prefix && <span className="pl-3 text-sm text-gray-400 select-none">{prefix}</span>}
                <input type="text" value={value} onChange={e => onChange(e.target.value)}
                    className={`w-full ${prefix ? 'pl-1' : 'pl-3'} pr-3 py-2.5 text-sm bg-transparent focus:outline-none text-gray-700`} />
            </div>
            {error && <p className="text-[11px] text-red-400 mt-1 font-medium">{error}</p>}
        </div>
    );
}

function SelectionIndicator({ selected }: { selected: boolean }) {
    return (
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${selected ? 'border-[#8B1E1E] bg-[#8B1E1E]' : 'border-gray-300'}`}>
            {selected && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
        </div>
    );
}

/* ═══════════════════════════════════════════
   Main Checkout Page
   ═══════════════════════════════════════════ */

export default function CheckoutPage() {
    const { items: cartItems, clearCart } = useCart();
    const { user, isAuthenticated, isLoading: authLoading, getIdToken } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // ─── Buy Now Mode: only bill the single product ───
    const isBuyNow = searchParams.get('buyNow') === 'true';
    const [buyNowItems, setBuyNowItems] = useState<any[]>([]);

    useEffect(() => {
        if (isBuyNow) {
            try {
                const raw = sessionStorage.getItem('mm-buy-now');
                if (raw) {
                    const item = JSON.parse(raw);
                    setBuyNowItems([item]);
                }
            } catch {
                // Invalid data, fall back to cart
            }
        }
    }, [isBuyNow]);

    // Use buyNow item if in buyNow mode, otherwise use full cart
    const items = isBuyNow && buyNowItems.length > 0 ? buyNowItems : cartItems;

    const [step, setStep] = useState(0);
    const [dir, setDir] = useState(1);
    const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
    const [saved, setSaved] = useState<Address[]>([]);
    const [selIdx, setSelIdx] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [payment, setPayment] = useState('upi');
    const [processing, setProcessing] = useState(false);
    const [done, setDone] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [errs, setErrs] = useState<Partial<Record<keyof Address, string>>>({});
    const [confetti, setConfetti] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [savingAddress, setSavingAddress] = useState(false);

    // ─── Load addresses from API (or localStorage fallback) ───
    useEffect(() => {
        async function loadAddresses() {
            setLoadingAddresses(true);
            try {
                const token = await getIdToken();
                if (token) {
                    // Fetch from backend
                    const response = await fetch(`${API_URL}/api/addresses`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.addresses.length > 0) {
                            setSaved(data.addresses);
                            setSelIdx(0);  // Select first (default) address
                            setShowForm(false);
                            setLoadingAddresses(false);
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load addresses from API:', error);
            }

            // Fallback: try localStorage
            try {
                const raw = localStorage.getItem('mm-addresses');
                if (raw) {
                    const arr = JSON.parse(raw);
                    if (arr.length > 0) {
                        setSaved(arr);
                        setSelIdx(0);
                        setShowForm(false);
                        setLoadingAddresses(false);
                        return;
                    }
                }
            } catch { /* ignore */ }

            // No saved addresses → show form
            setShowForm(true);
            setLoadingAddresses(false);
        }

        if (!authLoading && isAuthenticated) {
            loadAddresses();
        } else if (!authLoading) {
            setShowForm(true);
            setLoadingAddresses(false);
        }
    }, [authLoading, isAuthenticated]);

    useEffect(() => { if (!authLoading && !isAuthenticated) router.push('/login'); }, [authLoading, isAuthenticated, router]);
    useEffect(() => {
        if (!authLoading && items.length === 0 && !done) {
            // For buyNow mode, wait a moment for sessionStorage to load
            if (isBuyNow && buyNowItems.length === 0) return;
            router.push('/cart');
        }
    }, [authLoading, items, done, router, isBuyNow, buyNowItems]);
    useEffect(() => { if (user && !address.fullName) setAddress(p => ({ ...p, fullName: user.name || '' })); }, [user, address.fullName]);

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal >= 500 ? 0 : 49;
    const cod = payment === 'cod' && step === 2 ? 20 : 0;
    const total = subtotal + shipping + cod;

    const activeAddr = useCallback((): Address => {
        if (showForm || saved.length === 0) return address;
        if (selIdx !== null && saved[selIdx]) return saved[selIdx];
        return address;
    }, [showForm, saved, address, selIdx]);

    const validate = (): boolean => {
        const a = activeAddr();
        const e: Partial<Record<keyof Address, string>> = {};
        if (!a.fullName.trim()) e.fullName = 'Required';
        if (!a.phone.trim() || a.phone.length < 10) e.phone = 'Valid 10-digit number';
        if (!a.street.trim()) e.street = 'Required';
        if (!a.city.trim()) e.city = 'Required';
        if (!a.state) e.state = 'Required';
        if (!a.pincode.trim() || a.pincode.length !== 6) e.pincode = '6-digit pincode';
        setErrs(e);
        return Object.keys(e).length === 0;
    };

    const go = async (s: number) => {
        if (s === step) return;
        setDir(s > step ? 1 : -1);
        if (s > step && step === 0 && !validate()) return;

        // Save new address to backend when moving forward from step 0
        if (step === 0 && showForm && address.fullName) {
            setSavingAddress(true);
            try {
                const token = await getIdToken();
                if (token) {
                    const response = await fetch(`${API_URL}/api/addresses`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            fullName: address.fullName,
                            phone: address.phone,
                            street: address.street,
                            landmark: address.landmark,
                            city: address.city,
                            state: address.state,
                            pincode: address.pincode,
                            label: address.label,
                            isDefault: saved.length === 0,
                        }),
                    });

                    const data = await response.json();
                    if (data.success) {
                        const newAddress = data.address;
                        const arr = [...saved, newAddress];
                        setSaved(arr);
                        setSelIdx(arr.length - 1);
                        setShowForm(false);
                    } else {
                        // Fallback to localStorage
                        const arr = [...saved, address];
                        setSaved(arr);
                        localStorage.setItem('mm-addresses', JSON.stringify(arr));
                        setSelIdx(arr.length - 1);
                        setShowForm(false);
                    }
                } else {
                    // Not authenticated — save to localStorage
                    const arr = [...saved, address];
                    setSaved(arr);
                    localStorage.setItem('mm-addresses', JSON.stringify(arr));
                    setSelIdx(arr.length - 1);
                    setShowForm(false);
                }
            } catch (error) {
                console.error('Save address error:', error);
                // Fallback
                const arr = [...saved, address];
                setSaved(arr);
                localStorage.setItem('mm-addresses', JSON.stringify(arr));
                setSelIdx(arr.length - 1);
                setShowForm(false);
            } finally {
                setSavingAddress(false);
            }
        }
        setStep(s);
    };

    const placeOrder = async () => {
        setProcessing(true);
        await new Promise(r => setTimeout(r, 2800));
        const id = `MM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
        setOrderId(id);
        setProcessing(false);
        setDone(true);
        setConfetti(true);
        // In buyNow mode, only clear the sessionStorage (not the full cart)
        if (isBuyNow) {
            sessionStorage.removeItem('mm-buy-now');
        } else {
            clearCart();
        }
        setTimeout(() => setConfetti(false), 6000);
    };

    /* ── Loading ── */
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#F0EAE0] flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-[#8B1E1E] animate-spin" />
            </div>
        );
    }

    /* ══════════════════════════════════════
       ORDER SUCCESS — Elegant cream card
       ══════════════════════════════════════ */
    if (done) {
        return (
            <div className="min-h-screen bg-[#F0EAE0] flex items-center justify-center px-4 py-10">
                <Confetti active={confetti} />

                <motion.div initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="bg-white rounded-lg border border-gray-200 max-w-md w-full overflow-hidden relative z-10">

                    {/* Cream header — no green */}
                    <div className="px-8 pt-10 pb-8 text-center bg-[#FAF7F2]">
                        {/* Delicate maroon circle with checkmark */}
                        <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 160, damping: 15, delay: 0.2 }}
                            className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center border-[1.5px] border-[#8B1E1E]"
                        >
                            <Check className="w-6 h-6 text-[#8B1E1E]" strokeWidth={2} />
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="text-2xl sm:text-[28px] text-[#1A1A1A] mb-1.5"
                            style={{ fontFamily: SERIF, fontWeight: 700 }}>
                            Order Placed!
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                            className="text-sm text-gray-400 font-light">
                            Thank you for choosing Midhuna Masala
                        </motion.p>
                    </div>

                    <div className="p-6 sm:p-8">
                        {/* Order ID — clean with dotted underline */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                            className="text-center mb-6">
                            <p className="text-[10px] text-gray-400 uppercase tracking-[.15em] font-medium mb-1.5">Order ID</p>
                            <p className="text-xl font-mono tracking-wider text-[#8B1E1E] font-semibold"
                                style={{ textDecorationLine: 'underline', textDecorationStyle: 'dotted', textDecorationColor: '#D4C5B5', textUnderlineOffset: '6px' }}>
                                {orderId}
                            </p>
                        </motion.div>

                        {/* Details */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                            className="space-y-3 mb-8 py-5 border-t border-b border-gray-100">
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Truck className="w-4 h-4 text-[#8B1E1E]/60 flex-shrink-0" strokeWidth={1.5} />
                                <span className="font-light">Expected by{' '}
                                    <span className="font-medium text-gray-700">
                                        {new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}
                                    </span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Package className="w-4 h-4 text-[#8B1E1E]/60 flex-shrink-0" strokeWidth={1.5} />
                                <span className="font-light">Confirmation sent to{' '}
                                    <span className="font-medium text-gray-700">{user?.email}</span>
                                </span>
                            </div>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                            className="flex flex-col sm:flex-row gap-3">
                            <Link href="/track-order"
                                className="flex-1 bg-[#8B1E1E] text-white py-3 rounded-md font-medium text-sm hover:bg-[#6B1515] transition-colors text-center">
                                Track Order
                            </Link>
                            <Link href="/shop"
                                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors text-center">
                                Continue Shopping
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

    /* ══════════════════════════════════════
       Processing Modal — Maroon themed
       ══════════════════════════════════════ */
    const ProcessingModal = () => (
        <AnimatePresence>
            {processing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-lg p-8 max-w-xs w-full mx-4 text-center border border-gray-200">
                        <Loader2 className="w-10 h-10 text-[#8B1E1E] animate-spin mx-auto mb-5" strokeWidth={1.5} />
                        <h3 className="text-lg text-[#1A1A1A] mb-1" style={{ fontFamily: SERIF, fontWeight: 600 }}>
                            Processing Payment
                        </h3>
                        <p className="text-xs text-gray-400 font-light mb-5">Please do not close this window</p>
                        <div className="h-[2px] bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }}
                                transition={{ duration: 2.5 }}
                                className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #8B1E1E, #C4A265)' }} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    /* ══════════════════════════════════════
       MAIN CHECKOUT
       ══════════════════════════════════════ */
    return (
        <div className="min-h-screen bg-[#F0EAE0]">
            <ProcessingModal />
            <CheckoutHeader currentStep={step} onStepClick={(s) => go(s)} />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div>

                    {/* ══ Main Flow ══ */}
                    <div>
                        <AnimatePresence mode="wait" custom={dir}>
                            <motion.div key={step} custom={dir}
                                initial={{ x: dir > 0 ? 30 : -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, transition: { duration: 0.3 } }}
                                exit={{ x: dir > 0 ? -30 : 30, opacity: 0, transition: { duration: 0.2 } }}>

                                {/* ─── STEP 1: ADDRESS ─── */}
                                {step === 0 && (
                                    <SectionCard title="Delivery Address">
                                        {/* Loading addresses */}
                                        {loadingAddresses ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="w-5 h-5 text-[#8B1E1E] animate-spin mr-2" strokeWidth={1.5} />
                                                <span className="text-sm text-gray-400">Loading saved addresses...</span>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Saved addresses */}
                                                {saved.length > 0 && !showForm && (
                                                    <motion.div variants={staggerParent} initial="initial" animate="animate" className="space-y-3 mb-5">
                                                        {saved.map((a, idx) => (
                                                            <motion.div key={idx} variants={staggerChild}
                                                                onClick={() => setSelIdx(idx)}
                                                                className={`p-4 rounded-md cursor-pointer transition-all duration-300 ${selIdx === idx
                                                                    ? 'border border-[#8B1E1E] bg-[#8B1E1E]/[.02]'
                                                                    : 'border border-gray-100 hover:border-gray-200'
                                                                    }`}>
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="flex-1 min-w-0">
                                                                        <span className={`text-[10px] uppercase font-medium px-2 py-0.5 rounded tracking-wider ${a.label === 'home' ? 'bg-[#F5F0EB] text-[#8B6914]'
                                                                            : a.label === 'work' ? 'bg-gray-50 text-gray-500'
                                                                                : 'bg-gray-50 text-gray-400'
                                                                            }`}>{a.label}</span>
                                                                        <p className="font-medium text-gray-800 mt-2 text-[13px]">{a.fullName}</p>
                                                                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed font-light">
                                                                            {a.street}{a.landmark && `, ${a.landmark}`}<br />
                                                                            {a.city}, {a.state} — {a.pincode}
                                                                        </p>
                                                                        <p className="text-xs text-gray-300 mt-1.5 flex items-center gap-1">
                                                                            <Phone className="w-3 h-3" strokeWidth={1.5} /> +91 {a.phone}
                                                                        </p>
                                                                    </div>
                                                                    <div className="mt-1"><SelectionIndicator selected={selIdx === idx} /></div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                        <motion.button variants={staggerChild}
                                                            onClick={() => { setShowForm(true); setAddress({ ...EMPTY_ADDRESS, fullName: user?.name || '' }); }}
                                                            className="w-full py-3 border border-dashed border-gray-200 rounded-md text-sm font-medium text-gray-400 hover:text-[#8B1E1E] hover:border-[#8B1E1E]/30 transition-all flex items-center justify-center gap-2">
                                                            <Plus className="w-4 h-4" strokeWidth={1.5} /> Add New Address
                                                        </motion.button>
                                                    </motion.div>
                                                )}

                                                {/* New address form */}
                                                {(showForm || saved.length === 0) && (
                                                    <motion.div variants={staggerParent} initial="initial" animate="animate" className="space-y-4">
                                                        {saved.length > 0 && (
                                                            <motion.button variants={staggerChild}
                                                                onClick={() => { setShowForm(false); setSelIdx(0); }}
                                                                className="text-sm text-[#8B1E1E] font-medium hover:underline flex items-center gap-1">
                                                                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} /> Saved addresses
                                                            </motion.button>
                                                        )}
                                                        <motion.div variants={staggerChild} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <InputField label="Full Name" value={address.fullName} error={errs.fullName}
                                                                onChange={v => setAddress(p => ({ ...p, fullName: v }))} />
                                                            <InputField label="Phone Number" value={address.phone} error={errs.phone} prefix="+91"
                                                                onChange={v => setAddress(p => ({ ...p, phone: v.replace(/\D/g, '').slice(0, 10) }))} />
                                                        </motion.div>
                                                        <motion.div variants={staggerChild}>
                                                            <InputField label="Street Address" value={address.street} error={errs.street}
                                                                onChange={v => setAddress(p => ({ ...p, street: v }))} />
                                                        </motion.div>
                                                        <motion.div variants={staggerChild}>
                                                            <InputField label="Landmark (Optional)" value={address.landmark}
                                                                onChange={v => setAddress(p => ({ ...p, landmark: v }))} />
                                                        </motion.div>
                                                        <motion.div variants={staggerChild} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                            <InputField label="City" value={address.city} error={errs.city}
                                                                onChange={v => setAddress(p => ({ ...p, city: v }))} />
                                                            <div>
                                                                <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">State</label>
                                                                <select value={address.state}
                                                                    onChange={e => setAddress(p => ({ ...p, state: e.target.value }))}
                                                                    className={`w-full px-3 py-2.5 rounded-md border text-sm bg-white text-gray-700 ${errs.state ? 'border-red-300' : 'border-gray-200 focus:border-[#8B1E1E]/50'} focus:outline-none transition-colors`}>
                                                                    <option value="">Select</option>
                                                                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                                                </select>
                                                                {errs.state && <p className="text-[11px] text-red-400 mt-1">{errs.state}</p>}
                                                            </div>
                                                            <InputField label="Pincode" value={address.pincode} error={errs.pincode}
                                                                onChange={v => setAddress(p => ({ ...p, pincode: v.replace(/\D/g, '').slice(0, 6) }))} />
                                                        </motion.div>
                                                        <motion.div variants={staggerChild}>
                                                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Save As</label>
                                                            <div className="flex gap-2">
                                                                {([
                                                                    { k: 'home' as const, ic: Home, l: 'Home' },
                                                                    { k: 'work' as const, ic: Briefcase, l: 'Work' },
                                                                    { k: 'other' as const, ic: Pin, l: 'Other' },
                                                                ]).map(t => (
                                                                    <button key={t.k} onClick={() => setAddress(p => ({ ...p, label: t.k }))}
                                                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-all duration-300 ${address.label === t.k
                                                                            ? 'bg-[#8B1E1E] text-white'
                                                                            : 'border border-gray-200 text-gray-500 hover:border-[#8B1E1E]/30 hover:text-[#8B1E1E]'
                                                                            }`}>
                                                                        <t.ic className="w-3.5 h-3.5" strokeWidth={1.5} /> {t.l}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    </motion.div>
                                                )}

                                                <button onClick={() => go(1)} disabled={savingAddress || loadingAddresses}
                                                    className="w-full mt-6 bg-[#8B1E1E] text-white py-3 rounded-md font-medium text-sm hover:bg-[#6B1515] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50">
                                                    {savingAddress ? (
                                                        <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> Saving Address...</>
                                                    ) : (
                                                        <>Continue to Review <ChevronRight className="w-4 h-4" strokeWidth={1.5} /></>
                                                    )}
                                                </button>
                                            </>)}
                                    </SectionCard>
                                )}

                                {/* ─── STEP 2: REVIEW ─── */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <SectionCard title="Delivering to"
                                            action={<button onClick={() => go(0)} className="text-xs text-[#8B1E1E] font-medium hover:underline">Change</button>}>
                                            <p className="text-sm font-medium text-gray-800">{activeAddr().fullName}</p>
                                            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed font-light">
                                                {activeAddr().street}{activeAddr().landmark && `, ${activeAddr().landmark}`}<br />
                                                {activeAddr().city}, {activeAddr().state} — {activeAddr().pincode}
                                            </p>
                                            <p className="text-xs text-gray-300 mt-1.5 flex items-center gap-1">
                                                <Phone className="w-3 h-3" strokeWidth={1.5} /> +91 {activeAddr().phone}
                                            </p>
                                        </SectionCard>

                                        <SectionCard title={`Items (${items.length})`}>
                                            <motion.div variants={staggerParent} initial="initial" animate="animate"
                                                className="space-y-3">
                                                {items.map(item => (
                                                    <motion.div key={item.id} variants={staggerChild}
                                                        className="flex items-center gap-3.5">
                                                        <div className="w-12 h-12 bg-[#FAF7F2] rounded-md flex-shrink-0 overflow-hidden border border-gray-100">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[13px] font-medium text-gray-700 truncate">{item.name}</p>
                                                            <p className="text-xs text-gray-400 font-light">{item.weight} × {item.quantity}</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700">&#8377;{(item.price * item.quantity).toFixed(0)}</p>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </SectionCard>

                                        {/* Order Total */}
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <div className="px-6 py-4 border-b border-gray-100">
                                                <h2 className="text-base text-[#1A1A1A]" style={{ fontFamily: SERIF, fontWeight: 600 }}>Price Details</h2>
                                            </div>
                                            <div className="p-6 space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400 font-light">Subtotal</span>
                                                    <span className="font-medium text-gray-600">&#8377;{subtotal.toFixed(0)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400 font-light">Shipping</span>
                                                    <span className={`font-medium ${shipping === 0 ? 'text-[#8B1E1E]' : 'text-gray-600'}`}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                                                </div>

                                                <div className="h-[1px] bg-[#8B1E1E]/10 my-1" />
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700 text-sm">Total</span>
                                                    <span className="text-lg font-bold text-[#8B1E1E]" style={{ fontFamily: SERIF }}>&#8377;{total.toFixed(0)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delivery estimate */}
                                        <div className="bg-[#FAF7F2] rounded-md p-4 border border-gray-100 flex items-center gap-3">
                                            <Truck className="w-4 h-4 text-[#8B1E1E]/50 flex-shrink-0" strokeWidth={1.5} />
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Expected Delivery</p>
                                                <p className="text-sm text-gray-700 font-light">
                                                    {new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button onClick={() => go(0)}
                                                className="flex-1 py-3 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50">
                                                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> Back
                                            </button>
                                            <button onClick={() => go(2)}
                                                className="flex-1 py-3 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-1.5 bg-[#8B1E1E] text-white hover:bg-[#6B1515]">
                                                Payment <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ─── STEP 3: PAYMENT ─── */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <SectionCard title="Payment Method">
                                            <motion.div variants={staggerParent} initial="initial" animate="animate" className="space-y-2.5">
                                                {[
                                                    { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone, tag: 'Instant' },
                                                    { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard, tag: null },
                                                    { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: Landmark, tag: null },
                                                    { id: 'cod', label: 'Cash on Delivery', desc: 'Extra ₹20 COD charge', icon: Banknote, tag: '+₹20' },
                                                ].map(m => {
                                                    const IC = m.icon;
                                                    const on = payment === m.id;
                                                    return (
                                                        <motion.div key={m.id} variants={staggerChild}
                                                            onClick={() => setPayment(m.id)}
                                                            className={`p-4 rounded-md cursor-pointer transition-all duration-300 flex items-center gap-3.5 ${on ? 'border border-[#8B1E1E] bg-[#8B1E1E]/[.02]' : 'border border-gray-100 hover:border-gray-200'
                                                                }`}>
                                                            <IC className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-300 ${on ? 'text-[#8B1E1E]' : 'text-gray-300'
                                                                }`} strokeWidth={1.5} />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <p className={`text-[13px] font-medium transition-colors ${on ? 'text-gray-800' : 'text-gray-600'}`}>{m.label}</p>
                                                                    {m.tag && (
                                                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F5F0EB] text-[#8B6914]">
                                                                            {m.tag}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-400 mt-0.5 font-light">{m.desc}</p>
                                                            </div>
                                                            <SelectionIndicator selected={on} />
                                                        </motion.div>
                                                    );
                                                })}
                                            </motion.div>
                                        </SectionCard>


                                        <div className="flex gap-3">
                                            <button onClick={() => go(1)}
                                                className="flex-1 py-3 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50">
                                                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> Back
                                            </button>
                                            <button onClick={placeOrder} disabled={processing}
                                                className="flex-[2] bg-[#8B1E1E] text-white py-3 rounded-md font-medium text-sm hover:bg-[#6B1515] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                                <Lock className="w-3.5 h-3.5" strokeWidth={1.5} /> Pay &#8377;{total.toFixed(0)}
                                            </button>
                                        </div>
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
