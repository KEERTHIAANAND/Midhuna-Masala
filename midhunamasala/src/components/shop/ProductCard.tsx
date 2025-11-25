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
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
      {/* Product Image */}
      <div className="relative aspect-square bg-[#F5F0E8]">
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white px-3 py-1 text-xs font-bold text-[#8B1E1E] rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
        
        <div className="w-full h-full relative">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
            className="object-contain p-4"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-serif font-bold text-[#8B1E1E] mb-2" style={{ fontFamily: "'Crimson Text', serif" }}>
          {product.name}
        </h3>
        
        {/* Weight and Type */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <span className="italic">{product.weight || "100g"}</span>
          <span>•</span>
          <span className="italic">{product.type || "Stone Ground"}</span>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <svg className="w-3 h-3 text-[#F6C84C]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description || "Premium quality spice for authentic flavors"}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#8B1E1E]">
            ${product.price?.toFixed(2) || "5.99"}
          </span>
          <button className="bg-[#4A2511] hover:bg-[#3A1D0D] text-white px-4 py-2 rounded text-sm font-semibold transition-colors duration-300 uppercase tracking-wide">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
