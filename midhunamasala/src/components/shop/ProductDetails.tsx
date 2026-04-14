"use client";

import CloudImage from "@/components/common/CloudImage";
import React, { useState } from "react";
import { ShoppingCart, Heart, X, Star, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Product = {
    id: string;
    dbId?: string;  // Supabase UUID
    name: string;
    category: string;
    image: string;
    inStock?: boolean;
    price?: number;
    weight?: string;
    type?: string;
    description?: string;
    rating?: number;
};

interface ProductDetailsProps {
    product: Product;
    onClose: () => void;
}

const benefits = [
    "Rich in antioxidants & natural oils",
    "Supports digestive health",
    "No artificial preservatives"
];

export default function ProductDetails({ product, onClose }: ProductDetailsProps) {
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [liked, setLiked] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();

    const isOutOfStock = product.inStock === false;

    const handleAddToCart = () => {
        if (isOutOfStock) {
            alert('OUT OF STOCK');
            return;
        }
        const numericId = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        addToCart({
            id: numericId,
            productId: product.dbId,  // Supabase UUID for backend sync
            slug: product.id,          // Product slug
            name: product.name,
            weight: product.weight || "100g",
            price: product.price || 5.99,
            image: product.image,
            inStock: !isOutOfStock,
        }, quantity);

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleGetNow = () => {
        if (isOutOfStock) {
            alert('OUT OF STOCK');
            return;
        }
        const numericId = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        // Store this single product in sessionStorage for "Buy Now" checkout
        const buyNowItem = {
            id: numericId,
            productId: product.dbId,
            slug: product.id,
            name: product.name,
            weight: product.weight || "100g",
            price: product.price || 5.99,
            image: product.image,
            quantity: quantity,
            inStock: !isOutOfStock,
        };
        sessionStorage.setItem('mm-buy-now', JSON.stringify(buyNowItem));
        onClose();
        router.push('/checkout?buyNow=true');
    };

    const totalPrice = (product.price || 5.99) * quantity;

    return (
        <motion.div
            className="bg-gradient-to-br from-[#FAF7F2] to-[#EBE3D5] rounded-xl sm:rounded-2xl shadow-2xl border border-[#D4AF37]/30 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            {/* Close Button */}
            <motion.button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-[#8B1E1E] text-white rounded-full flex items-center justify-center hover:bg-[#6B1515] transition-all shadow-lg"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
            >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            <div className="flex flex-col lg:flex-row">
                {/* ── Left Side - Product Image ── */}
                <motion.div
                    className="lg:w-1/2 bg-gradient-to-br from-white to-[#FAF7F2] p-5 sm:p-10 flex items-center justify-center relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                >
                    {/* Decorative Corner Accents */}
                    <motion.div
                        className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-[#D4AF37]"
                        initial={{ opacity: 0, x: -10, y: -10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 0.4 }}
                    />
                    <motion.div
                        className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-[#D4AF37]"
                        initial={{ opacity: 0, x: 10, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 0.5 }}
                    />

                    {/* Image container */}
                    <div className="relative w-full aspect-square max-w-md">
                        <CloudImage
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* ♥ Like Button — Top Right Corner of Image */}
                    <motion.button
                        onClick={() => setLiked(!liked)}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-300"
                        style={{
                            backgroundColor: liked ? '#8B1E1E' : 'rgba(255,255,255,0.9)',
                        }}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.85 }}
                    >
                        <motion.div
                            animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Heart
                                className={`w-5 h-5 transition-colors duration-300 ${liked ? 'text-white fill-white' : 'text-[#8B1E1E]'}`}
                            />
                        </motion.div>
                    </motion.button>
                </motion.div>

                {/* ── Right Side - Product Details ── */}
                <motion.div
                    className="lg:w-1/2 p-5 sm:p-8 lg:p-10 bg-gradient-to-br from-[#8B1E1E] to-[#6B1515] text-white relative"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    {/* Decorative Background */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4AF37] rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        {/* Category */}
                        <motion.div
                            className="inline-flex items-center gap-3 mb-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
                            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-semibold">
                                {product.category}
                            </p>
                            <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
                        </motion.div>

                        {isOutOfStock && (
                            <motion.div
                                className="inline-flex mb-4 px-3 py-1 rounded-full bg-[#F5E6D3] text-[#8B1E1E] text-[10px] font-bold tracking-[0.18em] uppercase"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.32 }}
                            >
                                OUT OF STOCK
                            </motion.div>
                        )}

                        {/* Product Name */}
                        <motion.h2
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-[#F5E6D3]"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            {product.name}
                        </motion.h2>

                        {/* Type */}
                        <motion.p
                            className="text-[#F5E6D3]/70 text-sm mb-5 italic"
                            style={{ fontFamily: "'Crimson Text', serif" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {product.type || "Stone Ground"}
                        </motion.p>

                        {/* Rating */}
                        <motion.div
                            className="flex items-center gap-3 mb-6 pb-5 border-b border-[#D4AF37]/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45 }}
                        >
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star, index) => (
                                    <motion.div
                                        key={star}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + index * 0.05 }}
                                    >
                                        <Star
                                            className={`w-4 h-4 ${star <= Math.floor(product.rating || 4.8)
                                                ? 'text-[#D4AF37] fill-[#D4AF37]'
                                                : 'text-[#F5E6D3]/30'
                                                }`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                            <span className="text-[#F5E6D3]/70 text-sm">(4.8 rating)</span>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-3 font-semibold">Benefits</p>
                            <ul className="space-y-2.5 text-[#F5E6D3]/85 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>
                                {benefits.map((benefit, index) => (
                                    <motion.li key={index} className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.08 }}>
                                        <span className="text-[#D4AF37]">&#10022;</span>
                                        <span>{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Weight */}
                        <motion.div className="mb-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
                            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-2 font-semibold">Weight</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-[#D4AF37] text-[#8B1E1E] text-xs font-bold rounded">
                                    {product.weight || "100g"}
                                </button>
                                <button className="px-3 py-1 bg-[#F5E6D3]/15 text-[#F5E6D3] text-xs font-medium rounded hover:bg-[#F5E6D3]/25 transition-colors border border-[#D4AF37]/30">
                                    200g
                                </button>
                                <button className="px-3 py-1 bg-[#F5E6D3]/15 text-[#F5E6D3] text-xs font-medium rounded hover:bg-[#F5E6D3]/25 transition-colors border border-[#D4AF37]/30">
                                    500g
                                </button>
                            </div>
                        </motion.div>

                        {/* Quantity and Total */}
                        <motion.div className="flex items-center justify-between mb-6"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                            <div>
                                <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-2 font-semibold">Qty</p>
                                <div className="flex items-center gap-2">
                                    <motion.button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-6 h-6 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#8B1E1E] transition-all text-sm font-bold flex items-center justify-center"
                                        whileTap={{ scale: 0.85 }}>−</motion.button>
                                    <span className="text-[#F5E6D3] font-bold text-lg w-6 text-center">{quantity}</span>
                                    <motion.button onClick={() => setQuantity(quantity + 1)}
                                        className="w-6 h-6 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#8B1E1E] transition-all text-sm font-bold flex items-center justify-center"
                                        whileTap={{ scale: 0.85 }}>+</motion.button>
                                </div>
                            </div>
                            <div>
                                <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-2 font-semibold">Total</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[#F5E6D3] text-lg">₹</span>
                                    <span className="text-4xl font-bold text-[#F5E6D3]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons: Add to Cart + Get Now */}
                        <motion.div className="flex gap-3 sm:gap-4" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
                            {/* Add to Cart */}
                            <motion.button
                                onClick={handleAddToCart}
                                disabled={addedToCart || isOutOfStock}
                                className={`flex-1 py-3.5 px-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg border-2 ${addedToCart
                                    ? 'bg-green-500 text-white border-green-500'
                                    : isOutOfStock
                                        ? 'bg-transparent border-[#D4AF37]/30 text-[#D4AF37]/40 cursor-not-allowed'
                                        : 'bg-transparent border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]'
                                    }`}
                                style={{ fontFamily: "'Crimson Text', serif", letterSpacing: '0.05em' }}
                                whileHover={!addedToCart && !isOutOfStock ? { scale: 1.02 } : undefined}
                                whileTap={!addedToCart && !isOutOfStock ? { scale: 0.98 } : undefined}
                            >
                                <AnimatePresence mode="wait">
                                    {addedToCart ? (
                                        <motion.span key="added" className="flex items-center gap-2"
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Added!
                                        </motion.span>
                                    ) : (
                                        <motion.span key="add" className="flex items-center gap-2"
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Get Now — Direct to Checkout */}
                            <motion.button
                                onClick={handleGetNow}
                                disabled={isOutOfStock}
                                className={`flex-1 py-3.5 px-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#8B1E1E] hover:from-[#E5C04A] hover:to-[#C4A030] ${isOutOfStock ? 'opacity-50 cursor-not-allowed hover:from-[#D4AF37] hover:to-[#B8860B]' : ''}`}
                                style={{ fontFamily: "'Crimson Text', serif", letterSpacing: '0.05em' }}
                                whileHover={!isOutOfStock ? { scale: 1.02 } : undefined}
                                whileTap={!isOutOfStock ? { scale: 0.98 } : undefined}
                            >
                                <Zap className="w-5 h-5" />
                                Get Now
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}