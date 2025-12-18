"use client";

import Image from "next/image";
import React from "react";
import { ShoppingCart, Heart, X, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

type Product = {
    id: string;
    name: string;
    category: string;
    image: string;
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
    const [quantity, setQuantity] = React.useState(1);
    const [addedToCart, setAddedToCart] = React.useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: parseInt(product.id.replace(/\D/g, '') || '1'),
                name: product.name,
                weight: product.weight || "100g",
                price: product.price || 5.99,
                image: product.image,
                inStock: true,
            });
        }
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const totalPrice = (product.price || 5.99) * quantity;

    return (
        <motion.div
            className="bg-gradient-to-br from-[#FAF7F2] to-[#EBE3D5] rounded-2xl shadow-2xl border border-[#D4AF37]/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            {/* Close Button */}
            <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#8B1E1E] text-white rounded-full flex items-center justify-center hover:bg-[#6B1515] transition-all shadow-lg"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
            >
                <X className="w-5 h-5" />
            </motion.button>

            <div className="flex flex-col lg:flex-row">
                {/* Left Side - Product Image */}
                <motion.div
                    className="lg:w-1/2 bg-gradient-to-br from-white to-[#FAF7F2] p-10 flex items-center justify-center relative"
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

                    <motion.div
                        className="relative w-full aspect-square max-w-md"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain drop-shadow-xl"
                        />
                    </motion.div>
                </motion.div>

                {/* Right Side - Product Details */}
                <motion.div
                    className="lg:w-1/2 p-8 lg:p-10 bg-gradient-to-br from-[#8B1E1E] to-[#6B1515] text-white relative"
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

                        {/* Product Name */}
                        <motion.h2
                            className="text-3xl lg:text-4xl font-bold mb-2 text-[#F5E6D3]"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            {product.name}
                        </motion.h2>

                        {/* Type Only */}
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

                        {/* Benefits Section */}
                        <motion.div
                            className="mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55 }}
                        >
                            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-3 font-semibold">Benefits</p>
                            <ul className="space-y-2.5 text-[#F5E6D3]/85 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>
                                {benefits.map((benefit, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.08 }}
                                    >
                                        <span className="text-[#D4AF37]">✦</span>
                                        <span>{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Weight Selector */}
                        <motion.div
                            className="mb-5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.75 }}
                        >
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
                        <motion.div
                            className="flex items-center justify-between mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div>
                                <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-2 font-semibold">Qty</p>
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-6 h-6 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#8B1E1E] transition-all text-sm font-bold flex items-center justify-center"
                                        whileTap={{ scale: 0.85 }}
                                    >
                                        −
                                    </motion.button>
                                    <span className="text-[#F5E6D3] font-bold text-lg w-6 text-center">{quantity}</span>
                                    <motion.button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-6 h-6 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#8B1E1E] transition-all text-sm font-bold flex items-center justify-center"
                                        whileTap={{ scale: 0.85 }}
                                    >
                                        +
                                    </motion.button>
                                </div>
                            </div>
                            <div>
                                <p className="text-[#D4AF37] text-xs uppercase tracking-[0.15em] mb-2 font-semibold">Total</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[#F5E6D3] text-lg">₹</span>
                                    <span
                                        className="text-4xl font-bold text-[#F5E6D3]"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        {totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            className="flex gap-4"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.85 }}
                        >
                            <motion.button
                                onClick={handleAddToCart}
                                disabled={addedToCart}
                                className={`flex-1 py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${addedToCart
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#8B1E1E] hover:from-[#E5C04A] hover:to-[#C4A030]'
                                    }`}
                                style={{ fontFamily: "'Crimson Text', serif", letterSpacing: '0.05em' }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {addedToCart ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Added!
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                    </span>
                                )}
                            </motion.button>
                            <motion.button
                                className="py-3.5 px-5 rounded-xl border-2 border-[#D4AF37]/50 text-[#D4AF37] hover:text-[#F5E6D3] hover:border-[#F5E6D3] hover:bg-[#F5E6D3]/10 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Heart className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}