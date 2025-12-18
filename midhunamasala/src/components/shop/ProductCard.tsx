"use client";

import Image from "next/image";
import React from "react";
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

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onSelect: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, isSelected, onSelect, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      onClick={() => onSelect(product)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{
        scale: 1.03,
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className={`relative cursor-pointer group ${isSelected
        ? 'ring-2 ring-[#8B1E1E] shadow-xl'
        : ''
        }`}
    >
      {/* Simple Product Card - Fixed Height */}
      <motion.div
        className="bg-white overflow-hidden border border-gray-100 h-full flex flex-col"
        whileHover={{
          boxShadow: "0 20px 40px rgba(139, 30, 30, 0.15)",
        }}
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-[#FAF7F2] to-[#F5EDE1] overflow-hidden">
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-6"
            />
          </motion.div>

          {/* Selected indicator with animation */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute top-3 right-3 w-6 h-6 bg-[#8B1E1E] rounded-full flex items-center justify-center"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>
          )}

          {/* Hover overlay shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
            whileHover={{
              translateX: "200%",
              transition: { duration: 0.6, ease: "easeInOut" }
            }}
          />
        </div>

        {/* Product Info - Fixed Height */}
        <div className="p-4 text-center bg-white flex-1 flex flex-col items-center justify-center gap-2 min-h-[130px]">
          <motion.h3
            className="text-base font-bold text-[#8B1E1E] line-clamp-2 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {product.name}
          </motion.h3>

          {/* Elegant Price Display */}
          <motion.div
            className="relative inline-block mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {/* Price Label */}
            <span className="text-[10px] text-[#8B1E1E] uppercase tracking-[0.2em] font-semibold">
              Price
            </span>

            {/* Main Price */}
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-sm text-[#D4AF37] font-medium">₹</span>
              <span
                className="text-2xl font-bold text-[#333]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {product.price?.toFixed(0) || "5"}
              </span>
              <span
                className="text-sm font-bold text-[#666]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                .{((product.price || 5.99) % 1).toFixed(2).substring(2)}
              </span>
            </div>

            {/* Gold Accent Line with animation */}
            <motion.div
              className="mt-1 mx-auto h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
