"use client";

import Image from "next/image";
import React from "react";
import { ShoppingCart, Heart, X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

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

export default function ProductDetails({ product, onClose }: ProductDetailsProps) {
    const [quantity, setQuantity] = React.useState(1);
    const [activeTab, setActiveTab] = React.useState<'description' | 'details' | 'benefits'>('description');
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
        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden shadow-2xl animate-slideInUp">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col lg:flex-row">
                {/* Left Side - Product Image */}
                <div className="lg:w-1/2 bg-white p-8 flex items-center justify-center relative">
                    <div className="relative w-full aspect-square max-w-md">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain"
                        />
                    </div>

                    {/* Image Carousel Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#8B1E1E]"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                </div>

                {/* Right Side - Product Details */}
                <div className="lg:w-1/2 p-8 text-white">
                    {/* Category */}
                    <p className="text-[#D4AF37] text-sm uppercase tracking-widest mb-2">
                        {product.category}
                    </p>

                    {/* Product Name */}
                    <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {product.name}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-gray-400 text-sm mb-4">
                        {product.type || "Stone Ground"} • {product.weight || "100g"}
                    </p>

                    {/* Price and Rating */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-3xl font-bold text-white">
                            ₹{product.price?.toFixed(2) || "5.99"}
                        </p>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.floor(product.rating || 4.8)
                                            ? 'text-[#D4AF37] fill-[#D4AF37]'
                                            : 'text-gray-500'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-700 mb-4">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'description'
                                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'details'
                                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('benefits')}
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'benefits'
                                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Benefits
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="text-gray-300 text-sm leading-relaxed mb-6 min-h-[80px]">
                        {activeTab === 'description' && (
                            <p>
                                {product.description ||
                                    "Experience the authentic taste of traditional Chettinad spices. Our products are carefully stone-ground to preserve the natural oils and flavors that make Indian cuisine so special."}
                            </p>
                        )}
                        {activeTab === 'details' && (
                            <div className="space-y-2">
                                <p><span className="text-gray-400">Weight:</span> {product.weight || "100g"}</p>
                                <p><span className="text-gray-400">Type:</span> {product.type || "Stone Ground"}</p>
                                <p><span className="text-gray-400">Origin:</span> Chettinad, Tamil Nadu</p>
                                <p><span className="text-gray-400">Shelf Life:</span> 12 months</p>
                            </div>
                        )}
                        {activeTab === 'benefits' && (
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#D4AF37]">✦</span>
                                    <span>Rich in antioxidants and natural oils</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#D4AF37]">✦</span>
                                    <span>Supports digestive health</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#D4AF37]">✦</span>
                                    <span>No artificial colors or preservatives</span>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Weight Selector */}
                    <div className="mb-6">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Weight</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-[#D4AF37] text-black text-sm font-medium rounded">
                                {product.weight || "100g"}
                            </button>
                            <button className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded hover:bg-gray-600 transition-colors">
                                200g
                            </button>
                            <button className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded hover:bg-gray-600 transition-colors">
                                500g
                            </button>
                        </div>
                    </div>

                    {/* Quantity and Total */}
                    <div className="flex items-center gap-8 mb-6">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Quantity</p>
                            <div className="flex items-center gap-3 bg-gray-800 rounded px-3 py-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-white font-medium w-6 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Price</p>
                            <p className="text-2xl font-bold text-[#D4AF37]">
                                ₹{totalPrice.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={addedToCart}
                            className={`flex-1 py-3 px-6 rounded font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${addedToCart
                                    ? 'bg-green-600 text-white'
                                    : 'bg-[#D4AF37] text-black hover:bg-[#C4A030]'
                                }`}
                        >
                            {addedToCart ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Added to Cart
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </>
                            )}
                        </button>
                        <button className="py-3 px-4 rounded border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
