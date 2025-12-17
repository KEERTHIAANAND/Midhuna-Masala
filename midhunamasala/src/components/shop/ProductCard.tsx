"use client";

import Image from "next/image";
import React from "react";

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
}

export default function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  return (
    <div
      onClick={() => onSelect(product)}
      className={`relative cursor-pointer group transition-all duration-300 ${isSelected
        ? 'ring-2 ring-[#8B1E1E] shadow-xl scale-[1.02]'
        : 'hover:shadow-lg hover:scale-[1.01]'
        }`}
    >
      {/* Simple Product Card - Fixed Height */}
      <div className="bg-white overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-[#FAF7F2] to-[#F5EDE1] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-[#8B1E1E] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info - Fixed Height */}
        <div className="p-4 text-center bg-white flex-1 flex flex-col items-center justify-center gap-2 min-h-[130px]">
          <h3
            className="text-base font-bold text-[#8B1E1E] line-clamp-2 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.name}
          </h3>

          {/* Elegant Price Display */}
          <div className="relative inline-block mt-1">
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

            {/* Gold Accent Line */}
            <div className="mt-1 mx-auto w-12 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
