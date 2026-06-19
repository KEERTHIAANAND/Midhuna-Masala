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
    const [selectedWeight, setSelectedWeight] = useState(product.weight || "100g");
    const [addedToCart, setAddedToCart] = useState(false);
    const [liked, setLiked] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();

    const isOutOfStock = product.inStock === false;

    // Dynamically calculate price based on weight ratio
    const baseWeightNum = parseInt(product.weight || "100g") || 100;
    const selectedWeightNum = parseInt(selectedWeight) || 100;
    const displayPrice = (product.price || 5.99) * (selectedWeightNum / baseWeightNum);

    // Get unique available weights, sorted
    const availableWeights = Array.from(new Set([product.weight || "100g", "200g", "500g"])).sort((a, b) => parseInt(a) - parseInt(b));

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
            weight: selectedWeight,
            price: displayPrice,
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
            weight: selectedWeight,
            price: displayPrice,
            image: product.image,
            quantity: quantity,
            inStock: !isOutOfStock,
        };
        sessionStorage.setItem('mm-buy-now', JSON.stringify(buyNowItem));
        onClose();
        router.push('/checkout?buyNow=true');
    };

    const totalPrice = displayPrice * quantity;

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
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-8 h-8 sm:w-10 sm:h-10 bg-[#8B1E1E] text-white rounded-full flex items-center justify-center hover:bg-[#6B1515] transition-all shadow-lg"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
            >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            <div className="flex flex-col lg:flex-row">
                {/* ── Left Side - Product Image ── */}
                <motion.div
                    className="lg:w-1/2 bg-gradient-to-br from-white to-[#FAF7F2] p-4 sm:p-10 flex items-center justify-center relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                >
                    {/* Decorative Corner Accents (Hidden on mobile for cleaner look) */}
                    <motion.div
                        className="hidden sm:block absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-[#D4AF37]"
                        initial={{ opacity: 0, x: -10, y: -10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 0.4 }}
                    />
                    <motion.div
                        className="hidden sm:block absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-[#D4AF37]"
                        initial={{ opacity: 0, x: 10, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 0.5 }}
                    />

                    {/* Image container */}
                    <div className="relative w-48 h-48 sm:w-full sm:h-auto sm:aspect-square max-w-md">
                        <CloudImage
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 192px, 50vw"
                            className="object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* ♥ Like Button — Bottom Right on Mobile to avoid Close Button overlap, Top Right on Desktop */}
                    <motion.button
                        onClick={() => setLiked(!liked)}
                        className="absolute bottom-4 right-4 sm:top-6 sm:bottom-auto sm:right-6 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-300 border border-[#D4AF37]/20"
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
                    className="lg:w-1/2 p-4 sm:p-8 lg:p-10 bg-gradient-to-br from-[#8B1E1E] to-[#6B1515] text-white relative"
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
                            className="text-xl sm:text-3xl lg:text-4xl font-bold mb-2 text-[#F5E6D3] leading-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            {product.name}
                        </motion.h2>



                        {/* Rating */}
                        <motion.div
                            className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-5 border-b border-[#D4AF37]/30"
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
                        <motion.div className="mb-4 sm:mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-2 sm:mb-3 font-semibold">Benefits</p>
                            <ul className="space-y-1.5 sm:space-y-2.5 text-[#F5E6D3]/85 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>
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
                        <motion.div className="mb-4 sm:mb-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
                            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-2 font-semibold">Weight</p>
                            <div className="flex flex-wrap gap-2">
                                {availableWeights.map((w) => (
                                    <button
                                        key={w}
                                        onClick={() => setSelectedWeight(w)}
                                        className={`px-3 py-1 text-xs font-bold rounded transition-colors border ${
                                            selectedWeight === w
                                                ? "bg-[#D4AF37] text-[#8B1E1E] border-[#D4AF37]"
                                                : "bg-[#F5E6D3]/15 text-[#F5E6D3] border-[#D4AF37]/30 hover:bg-[#F5E6D3]/25 font-medium"
                                        }`}
                                    >
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quantity and Total */}
                        <motion.div className="flex items-center justify-between mb-4 sm:mb-6"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                            <div>
                                <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-1 sm:mb-2 font-semibold text-left">Total</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[#F5E6D3] text-lg">₹</span>
                                    <span className="text-3xl sm:text-4xl font-bold text-[#F5E6D3]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-1 sm:mb-2 font-semibold text-center">Qty</p>
                                <div className="flex items-center gap-2 justify-end">
                                    <motion.button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-6 h-6 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#8B1E1E] transition-all text-sm font-bold flex items-center justify-center"
                                        whileTap={{ scale: 0.85 }}>−</motion.button>
                                    <span className="text-[#F5E6D3] font-bold text-lg w-6 text-center">{quantity}</span>
                                    <motion.button onClick={() => setQuantity(quantity + 1)}
                                        className="w-6 h-6 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#8B1E1E] transition-all text-sm font-bold flex items-center justify-center"
                                        whileTap={{ scale: 0.85 }}>+</motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons: Add to Cart + Get Now */}
                        <motion.div className="flex flex-row gap-3 sm:gap-5 mt-2 sm:mt-0" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
                            {/* Add to Cart */}
                            <motion.button
                                onClick={handleAddToCart}
                                disabled={addedToCart || isOutOfStock}
                                className={`flex-1 py-3 sm:py-4 px-2 sm:px-5 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 border ${addedToCart
                                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                    : isOutOfStock
                                        ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                                        : 'bg-white/10 backdrop-blur-md border-white/20 text-[#F5E6D3] hover:bg-white/20 hover:border-white/40 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                    }`}
                                style={{ fontFamily: "'Crimson Text', serif", letterSpacing: '0.05em' }}
                                whileHover={!addedToCart && !isOutOfStock ? { scale: 1.03 } : undefined}
                                whileTap={!addedToCart && !isOutOfStock ? { scale: 0.97 } : undefined}
                            >
                                <AnimatePresence mode="wait">
                                    {addedToCart ? (
                                        <motion.span key="added" className="flex items-center gap-1.5 sm:gap-2"
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Added!
                                        </motion.span>
                                    ) : (
                                        <motion.span key="add" className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                            Add to Cart
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Get Now — Direct to Checkout */}
                            <motion.button
                                onClick={handleGetNow}
                                disabled={isOutOfStock}
                                className={`flex-1 py-3 sm:py-4 px-2 sm:px-5 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-500 text-white' : 'bg-[#D4AF37] text-[#5A1010] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-[#F6C84C] hover:shadow-[0_0_25px_rgba(246,200,76,0.5)]'}`}
                                style={{ fontFamily: "'Crimson Text', serif", letterSpacing: '0.05em' }}
                                whileHover={!isOutOfStock ? { scale: 1.03 } : undefined}
                                whileTap={!isOutOfStock ? { scale: 0.97 } : undefined}
                            >
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="whitespace-nowrap">Buy Now</span>
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}