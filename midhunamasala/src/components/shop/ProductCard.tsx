"use client";

import Image from "next/image";
import React from "react";
import { ShoppingCart, Info, X } from "lucide-react";

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
  const [showDetails, setShowDetails] = React.useState(false);
  const [showAyurvedic, setShowAyurvedic] = React.useState(false);
  
  return (
    <div className="relative h-[480px] group">
      {/* Main Product Card */}
      <div className="relative w-full h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        
        {/* Product Image Section with Animation */}
        <div className="relative aspect-square bg-[#F5EDE1] overflow-hidden">
          {/* Product Content */}
          <div 
            className={`relative w-full h-full transition-all duration-500 ${
              showDetails ? 'blur-sm scale-95 opacity-50' : ''
            }`}
          >
            {/* Category Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-white px-3 py-1 text-xs font-bold text-[#755C48] rounded-full shadow-sm">
                {product.category}
              </span>
            </div>
            
            {/* Info Icon - Bottom Right */}
            <button
              onClick={() => setShowDetails(true)}
              className="absolute bottom-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 border border-[#755C48] hover:border-[#D4AF37]"
              title="View product details"
            >
              <Info className="w-4 h-4 text-[#755C48]" />
            </button>
        
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

          {/* Sliding Details Overlay - Only over image */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-[#FFFEF9] to-[#FFF8E7] overflow-hidden transition-all duration-700 ease-out ${
              showDetails 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-full opacity-0 pointer-events-none'
            }`}
            style={{
              boxShadow: showDetails ? '0 -10px 40px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <div className="relative w-full h-full flex flex-col justify-between p-6">
              {/* Decorative Gear Design - Top Right Corner */}
              <div className="absolute -top-8 -right-8 w-32 h-32 opacity-20">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <path d="M50 10 L55 25 L70 20 L65 35 L80 35 L70 45 L80 55 L65 55 L70 70 L55 65 L50 80 L45 65 L30 70 L35 55 L20 55 L30 45 L20 35 L35 35 L30 20 L45 25 Z" fill="#8B6F47" stroke="#8B6F47" strokeWidth="2"/>
                  <circle cx="50" cy="45" r="12" fill="#FFF8E7" stroke="#8B6F47" strokeWidth="2"/>
                </svg>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 border border-[#8B6F47] hover:border-[#D4AF37] z-20"
                title="Close details"
              >
                <X className="w-4 h-4 text-[#8B6F47]" />
              </button>

              <div>
                {/* Chef Icon and Rating */}
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
                      <path d="M8.5 7C8.5 5.067 10.067 3.5 12 3.5C13.933 3.5 15.5 5.067 15.5 7" stroke="#8B6F47" strokeWidth="1.5" strokeLinecap="round"/>
                      <rect x="6" y="7" width="12" height="13" rx="1" stroke="#8B6F47" strokeWidth="1.5" fill="none"/>
                      <path d="M9 7V10M12 7V10M15 7V10" stroke="#8B6F47" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="bg-[#6B2C2C] text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm font-bold">4.8</span>
                  </div>
                </div>

                {/* Flavor Profile Title */}
                <h3 className="text-center text-lg font-bold text-[#8B3A3A] mb-4" style={{ fontFamily: "'Crimson Text', serif" }}>
                  Flavor Profile
                </h3>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed text-center italic" style={{ fontFamily: "'Crimson Text', serif" }}>
                    {product.description || "Sun-dried Guntur chillies, stone-ground to preserve the fiery heat and vibrant red color used in traditional curries."}
                  </p>
                </div>

                {/* Best Used For */}
                <div className="mb-4">
                  <h4 className="text-center text-xs font-bold text-[#8B6F47] mb-2 tracking-wider">
                    BEST USED FOR
                  </h4>
                  <p className="text-sm text-gray-700 text-center" style={{ fontFamily: "'Crimson Text', serif" }}>
                    Curries, Marinades, and Traditional Gravies
                  </p>
                </div>

                {/* Ayurvedic Secret Button */}
                <button
                  onClick={() => setShowAyurvedic(!showAyurvedic)}
                  className="w-full relative overflow-hidden group/btn mt-3"
                >
                  <div className="bg-gradient-to-r from-[#8B6F47] to-[#6B5537] text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#D4AF37]">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" fill="currentColor" opacity="0.5"/>
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                      </svg>
                      <span className="text-xs font-serif font-bold tracking-wide" style={{ fontFamily: "'Crimson Text', serif" }}>
                        Ayurvedic Secret
                      </span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" fill="currentColor" opacity="0.5"/>
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  {/* Golden shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover/btn:opacity-30 transform -translate-x-full group-hover/btn:translate-x-full transition-all duration-700"></div>
                </button>

                {/* Ayurvedic Benefits Panel */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ${
                    showAyurvedic ? 'max-h-32 mt-3 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-gradient-to-br from-[#FFF8E7] to-[#F5EDE1] p-3 rounded-lg border-2 border-[#D4AF37] shadow-inner">
                    <h4 className="text-xs font-bold text-[#8B6F47] mb-2 text-center tracking-wider flex items-center justify-center gap-2">
                      <span className="text-[#D4AF37]">✦</span>
                      AYURVEDIC BENEFITS
                      <span className="text-[#D4AF37]">✦</span>
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1" style={{ fontFamily: "'Crimson Text', serif" }}>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] mt-0.5">•</span>
                        <span>Aids digestion and metabolism</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] mt-0.5">•</span>
                        <span>Anti-inflammatory properties</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] mt-0.5">•</span>
                        <span>Boosts immunity naturally</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Divider */}
              <div className="mt-4 pt-3 border-t-2 border-[#8B6F47]"></div>
            </div>
          </div>
        </div>

        {/* Static Product Info Section */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="text-lg font-serif font-bold text-[#755C48] mb-2" style={{ fontFamily: "'Crimson Text', serif" }}>
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
            <svg className="w-3 h-3 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Price and Cart */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-[#755C48]" style={{ fontFamily: "'Times New Roman', serif" }}>
              ₹{product.price?.toFixed(2) || "5.99"}
            </span>
            <button className="bg-[#755C48] hover:bg-[#5A4536] text-white p-2 rounded transition-colors duration-300 shadow-md hover:shadow-lg">
              <ShoppingCart className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
