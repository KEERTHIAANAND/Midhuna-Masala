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
  rating?: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [showAyurvedic, setShowAyurvedic] = React.useState(false);
  
  return (
    <div className="relative h-[480px] group">
      {/* Rating Tag - Top Right Corner (Ribbon Style) - Only visible when details are hidden */}
      {!showDetails && (
        <div className="absolute top-0 right-2 z-20">
          <div className="relative w-8">
            {/* Main ribbon body */}
            <div className="bg-[#A02C2C] shadow-lg px-1 py-1.5">
              <div className="flex flex-col items-center justify-center text-white gap-0.5">
                <svg className="w-2.5 h-2.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <span className="text-[10px] font-bold leading-none">{product.rating || 4.8}</span>
              </div>
            </div>
            {/* Ribbon tail - Straight sides with extended V-notch in center */}
            <div className="w-full" style={{ height: '10px' }}>
              <svg width="100%" height="10" viewBox="0 0 40 16" preserveAspectRatio="none" className="block">
                {/* Straight left and right sides, wider and deeper V-notch in center */}
                <polygon points="0,0 0,16 1,16 20,1 39,16 40,16 40,0" fill="#A02C2C" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Main Product Card */}
      <div className="relative w-full h-full bg-white rounded-lg overflow-visible shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        
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
            <div className="relative w-full h-full p-5">
              {/* Decorative Gear Design - Top Right Corner */}
              <div className="absolute -top-7 -right-7 w-28 h-28 opacity-20">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <path d="M50 10 L55 25 L70 20 L65 35 L80 35 L70 45 L80 55 L65 55 L70 70 L55 65 L50 80 L45 65 L30 70 L35 55 L20 55 L30 45 L20 35 L35 35 L30 20 L45 25 Z" fill="#8B6F47" stroke="#8B6F47" strokeWidth="2"/>
                  <circle cx="50" cy="45" r="12" fill="#FFF8E7" stroke="#8B6F47" strokeWidth="2"/>
                </svg>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-2.5 right-2.5 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 border border-[#8B6F47] hover:border-[#D4AF37] z-20"
                title="Close details"
              >
                <X className="w-4 h-4 text-[#8B6F47]" />
              </button>

              {/* Content - Changes based on ayurvedic state */}
              {!showAyurvedic ? (
                <>
                  {/* Chef Icon */}
                  <div className="flex justify-center items-start mb-2.5">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9">
                        <path d="M8.5 7C8.5 5.067 10.067 3.5 12 3.5C13.933 3.5 15.5 5.067 15.5 7" stroke="#8B6F47" strokeWidth="1.5" strokeLinecap="round"/>
                        <rect x="6" y="7" width="12" height="13" rx="1" stroke="#8B6F47" strokeWidth="1.5" fill="none"/>
                        <path d="M9 7V10M12 7V10M15 7V10" stroke="#8B6F47" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Flavor Profile Title */}
                  <h3 className="text-center text-lg font-bold text-[#8B3A3A] mb-2.5" style={{ fontFamily: "'Crimson Text', serif" }}>
                    Flavor Profile
                  </h3>

                  {/* Description */}
                  <div className="mb-2.5">
                    <p className="text-sm text-gray-700 leading-relaxed text-center italic" style={{ fontFamily: "'Crimson Text', serif" }}>
                      {product.description || "Sun-dried Guntur chillies, stone-ground to preserve the fiery heat and vibrant red color used in traditional curries."}
                    </p>
                  </div>

                  {/* Best Used For */}
                  <div className="mb-3">
                    <h4 className="text-center text-xs font-bold text-[#8B6F47] mb-1.5 tracking-wider">
                      BEST USED FOR
                    </h4>
                    <p className="text-sm text-gray-700 text-center" style={{ fontFamily: "'Crimson Text', serif" }}>
                      Curries, Marinades, and Traditional Gravies
                    </p>
                  </div>

                  {/* Ayurvedic Benefits Link */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAyurvedic(true);
                    }}
                    className="w-full group/btn"
                  >
                    <div className="relative py-1.5 px-4 bg-gradient-to-r from-[#FFF8E7] via-white to-[#FFF8E7] rounded-md border border-[#D4AF37] hover:border-[#8B6F47] transition-all duration-300 shadow-sm hover:shadow-md">
                      {/* Corner decorations */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#D4AF37]"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#D4AF37]"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#D4AF37]"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#D4AF37]"></div>
                      
                      {/* Center content */}
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-3.5 h-3.5 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                        <span className="text-sm text-[#8B6F47] group-hover/btn:text-[#6B5537] transition-colors font-semibold tracking-wide" style={{ fontFamily: "'Crimson Text', serif" }}>
                          Ayurvedic Benefits
                        </span>
                        <svg className="w-3.5 h-3.5 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                      </div>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  {/* Back Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAyurvedic(false);
                    }}
                    className="mb-3 flex items-center gap-1.5 text-[#8B6F47] hover:text-[#6B5537] transition-colors"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span className="text-xs font-bold">Back</span>
                  </button>

                  {/* Ayurvedic Benefits Title */}
                  <div className="text-center mb-3">
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <svg className="w-4 h-4 text-[#D4AF37]" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" fill="currentColor" opacity="0.5"/>
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                      </svg>
                      <h3 className="text-base font-bold text-[#8B3A3A]" style={{ fontFamily: "'Crimson Text', serif" }}>
                        Ayurvedic Benefits
                      </h3>
                      <svg className="w-4 h-4 text-[#D4AF37]" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" fill="currentColor" opacity="0.5"/>
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>

                  {/* Decorative Divider */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                    <svg className="w-2.5 h-2.5 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                  </div>

                  {/* Benefits List - Simple without boxes */}
                  <div className="space-y-3 px-2">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#D4AF37] text-lg mt-0.5">✦</span>
                      <div>
                        <h4 className="text-sm font-bold text-[#8B6F47]">Digestive Health</h4>
                        <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: "'Crimson Text', serif" }}>
                          Aids digestion and boosts metabolism
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#D4AF37] text-lg mt-0.5">✦</span>
                      <div>
                        <h4 className="text-sm font-bold text-[#8B6F47]">Anti-Inflammatory</h4>
                        <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: "'Crimson Text', serif" }}>
                          Reduces inflammation naturally
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="text-[#D4AF37] text-lg mt-0.5">✦</span>
                      <div>
                        <h4 className="text-sm font-bold text-[#8B6F47]">Immunity Boost</h4>
                        <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: "'Crimson Text', serif" }}>
                          Rich in antioxidants for immunity
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
