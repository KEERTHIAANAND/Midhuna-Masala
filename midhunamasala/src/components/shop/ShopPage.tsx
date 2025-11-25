"use client";

import React from "react";
import Image from "next/image";
import ProductCard from "@/components/shop/ProductCard";
import { ChevronRight, Filter } from "lucide-react";

const products = [
  { 
    id: "guntur-red-chilli", 
    name: "Guntur Red Chilli Powder", 
    category: "POWDER",
    weight: "200g",
    type: "Stone Ground",
    image: "/images/products/IMG-20250726-WA0019.jpg",
    price: 6.49,
    description: "Sun-dried Guntur chillies, stone-ground to preserve the fiery heat.."
  },
  { 
    id: "erode-turmeric", 
    name: "Erode Turmeric Powder (Manjal)", 
    category: "POWDER",
    weight: "100g",
    type: "Stone Ground",
    image: "/images/products/IMG-20250727-WA0006.jpg",
    price: 4.99,
    description: "Pure Erode turmeric with high curcumin content. Traditionally..."
  },
  { 
    id: "chettinad-masala", 
    name: "Chettinad Masala Blend", 
    category: "BLEND",
    weight: "100g",
    type: "Stone Ground",
    image: "/images/products/IMG-20250726-WA0021.jpg",
    price: 9.99,
    description: "Authentic 18-spice blend roasted in iron woks. The secret to the..."
  },
  { 
    id: "cumin", 
    name: "Cumin Seeds", 
    category: "POWDER",
    weight: "100g",
    type: "Stone Ground",
    image: "/images/products/IMG-20250726-WA0022.jpg",
    price: 5.49,
    description: "Premium cumin seeds with rich aroma and flavor"
  },
  { 
    id: "coriander", 
    name: "Coriander Seeds", 
    category: "POWDER",
    weight: "100g",
    type: "Stone Ground",
    image: "/images/products/IMG-20250726-WA0023.jpg",
    price: 4.49,
    description: "Fresh coriander seeds for authentic taste"
  },
  { 
    id: "fennel", 
    name: "Fennel Seeds", 
    category: "WHOLE SPICES",
    weight: "100g",
    type: "Seeds & Pods",
    image: "/images/products/IMG-20250726-WA0022.jpg",
    price: 5.99,
    description: "Sweet and aromatic fennel seeds"
  },
];

const collections = [
  {
    id: "all",
    title: "ALL COLLECTION",
    subtitle: "COMPLETE RANGE",
    color: "white"
  },
  {
    id: "whole-spices",
    title: "WHOLE SPICES",
    subtitle: "SEEDS & PODS",
    color: "white"
  },
  {
    id: "ground-powders",
    title: "GROUND POWDERS",
    subtitle: "DAILY ESSENTIALS",
    color: "white"
  },
  {
    id: "secret-blends",
    title: "SECRET BLENDS",
    subtitle: "SPECIAL MASALAS",
    color: "white"
  },
];

export default function ShopPage() {
  const [selectedCollection, setSelectedCollection] = React.useState("all");
  
  // Filter products based on selected collection
  const filteredProducts = React.useMemo(() => {
    if (selectedCollection === "all") {
      return products;
    }
    
    const categoryMap: Record<string, string[]> = {
      "whole-spices": ["WHOLE SPICES"],
      "ground-powders": ["POWDER"],
      "secret-blends": ["BLEND"]
    };
    
    const allowedCategories = categoryMap[selectedCollection] || [];
    return products.filter(p => allowedCategories.includes(p.category));
  }, [selectedCollection]);
  
  return (
    <div className="bg-[#F5F0E8]">
      {/* Classical Shop Banner */}
      <section className="relative w-full h-[400px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/images/banners/shopbanner.jpg" 
            alt="The Royal Spice Pantry" 
            fill
            priority
            className="object-cover"
            quality={100} 
            style={{ objectFit: "cover" }}
          />
          {/* Maroon gradient overlay on left side for text background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B1E1E] via-[#8B1E1E]/80 to-transparent" style={{ width: '85%' }}></div>
        </div>

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 max-w-3xl">
          {/* Premium Selection Badge */}
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-[#F6C84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <span className="text-[#F6C84C] text-sm tracking-[0.3em] uppercase font-medium">
              Premium Selection
            </span>
            <svg className="w-5 h-5 text-[#F6C84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 700 }}>
            The Royal
          </h1>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F6C84C] mb-6 leading-tight" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 700 }}>
            Spice Pantry
          </h1>

          {/* Decorative Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-[#F6C84C]"></div>
            <svg className="w-4 h-4 text-[#F6C84C]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <div className="w-12 h-[2px] bg-[#F6C84C]"></div>
          </div>

          {/* Subheading */}
          <p className="text-white text-base md:text-lg leading-relaxed italic" style={{ fontFamily: "'Crimson Text', serif" }}>
            Curated for the connoisseurs of authentic Chettinad cuisine
          </p>
        </div>

        {/* Bottom Golden Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F6C84C] to-[#D4AF37]"></div>
      </section>

      {/* Main Shop Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Collections */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Collections Header */}
              <div className="p-6 pb-4 border-b-4 border-[#F6C84C]">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#8B1E1E]" />
                  <h2 className="text-2xl font-serif text-[#8B1E1E]" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 700 }}>
                    Pantry
                  </h2>
                </div>
              </div>

              {/* Collection Items */}
              <div className="p-6 space-y-4">
                {collections.map((collection) => {
                  const isSelected = selectedCollection === collection.id;
                  
                  // Negative space style SVG icons for each collection
                  const getCollectionIcon = (id: string) => {
                    const isSelected = selectedCollection === id;
                    const iconColor = isSelected ? "#FFFFFF" : "#8B1E1E";
                    
                    switch(id) {
                      case "all":
                        return (
                          <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                            {/* Grid/Catalog layout - 3x3 grid representing all products */}
                            <rect x="12" y="12" width="8" height="8" rx="1" fill={iconColor} />
                            <rect x="22" y="12" width="8" height="8" rx="1" fill={iconColor} />
                            <rect x="32" y="12" width="8" height="8" rx="1" fill={iconColor} />
                            <rect x="12" y="22" width="8" height="8" rx="1" fill={iconColor} />
                            <rect x="22" y="22" width="8" height="8" rx="1" fill={iconColor} />
                            <rect x="32" y="22" width="8" height="8" rx="1" fill={iconColor} />
                            <rect x="12" y="32" width="8" height="8" rx="1" fill={iconColor} />
                            <rect x="22" y="32" width="8" height="8" rx="1" fill={iconColor} />
                            <rect x="32" y="32" width="8" height="8" rx="1" fill={iconColor} />
                          </svg>
                        );
                      case "whole-spices":
                        return (
                          <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                            {/* Leaf with stem */}
                            <path d="M24 8C24 8 20 10 18 14C16 18 16 22 18 25C20 28 23 30 24 30C24 30 24 26 24 22C24 18 24 14 24 8Z" 
                              fill={iconColor} />
                            <path d="M24 8C24 8 28 10 30 14C32 18 32 22 30 25C28 28 25 30 24 30C24 30 24 26 24 22C24 18 24 14 24 8Z" 
                              fill={iconColor} />
                            {/* Peppercorns at bottom */}
                            <circle cx="18" cy="36" r="2.5" fill={iconColor} />
                            <circle cx="24" cy="38" r="3" fill={iconColor} />
                            <circle cx="30" cy="36" r="2.5" fill={iconColor} />
                            <circle cx="21" cy="34" r="1.8" fill={iconColor} />
                            <circle cx="27" cy="34" r="1.8" fill={iconColor} />
                          </svg>
                        );
                      case "ground-powders":
                        return (
                          <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                            {/* Mortar bowl */}
                            <path d="M12 20C12 20 12 18 14 16C16 14 18 13 24 13C30 13 32 14 34 16C36 18 36 20 36 20" 
                              stroke={iconColor} strokeWidth="2" fill="none" strokeLinecap="round" />
                            <ellipse cx="24" cy="20" rx="12" ry="3" fill={iconColor} />
                            <path d="M12 20L13 30C13 34 17 38 24 38C31 38 35 34 35 30L36 20" 
                              stroke={iconColor} strokeWidth="2" fill="none" strokeLinecap="round" />
                            
                            {/* Pestle */}
                            <path d="M30 6C30 6 31 6 32 7C33 8 33 9 32 10L28 18" 
                              stroke={iconColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="31" cy="6.5" r="2" fill={iconColor} />
                            
                            {/* Powder/spices in mortar */}
                            <circle cx="20" cy="24" r="1.5" fill={iconColor} opacity="0.7" />
                            <circle cx="24" cy="26" r="1.2" fill={iconColor} opacity="0.7" />
                            <circle cx="28" cy="24" r="1.5" fill={iconColor} opacity="0.7" />
                            <circle cx="22" cy="28" r="1" fill={iconColor} opacity="0.5" />
                            <circle cx="26" cy="28" r="1" fill={iconColor} opacity="0.5" />
                            <path d="M18 24C18 24 20 26 24 26C28 26 30 24 30 24" 
                              stroke={iconColor} strokeWidth="1.2" strokeDasharray="1 1" opacity="0.4" fill="none" />
                          </svg>
                        );
                      case "secret-blends":
                        return (
                          <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                            {/* Spice bowl */}
                            <path d="M10 18C10 18 10 16 12 14C14 12 18 10 24 10C30 10 34 12 36 14C38 16 38 18 38 18" 
                              stroke={iconColor} strokeWidth="2" fill="none" strokeLinecap="round" />
                            <ellipse cx="24" cy="18" rx="14" ry="3.5" fill={iconColor} />
                            <path d="M10 18C10 18 9 26 10 32C11 38 16 42 24 42C32 42 37 38 38 32C39 26 38 18 38 18" 
                              stroke={iconColor} strokeWidth="2" fill="none" strokeLinecap="round" />
                            
                            {/* Multiple spices/blends in bowl - layered look */}
                            <ellipse cx="24" cy="24" rx="10" ry="2.5" fill={iconColor} opacity="0.3" />
                            <ellipse cx="24" cy="28" rx="8" ry="2" fill={iconColor} opacity="0.4" />
                            
                            {/* Spice particles/texture */}
                            <circle cx="18" cy="22" r="1.2" fill={iconColor} opacity="0.7" />
                            <circle cx="24" cy="23" r="1.5" fill={iconColor} opacity="0.7" />
                            <circle cx="30" cy="22" r="1.2" fill={iconColor} opacity="0.7" />
                            <circle cx="21" cy="26" r="1" fill={iconColor} opacity="0.6" />
                            <circle cx="27" cy="26" r="1" fill={iconColor} opacity="0.6" />
                            <circle cx="24" cy="30" r="1.2" fill={iconColor} opacity="0.5" />
                            
                            {/* Aroma/steam lines rising from bowl */}
                            <path d="M18 10C18 10 18 6 20 6C22 6 22 10 22 10" 
                              stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                            <path d="M24 8C24 8 24 4 26 4C28 4 28 8 28 8" 
                              stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                            <path d="M30 10C30 10 30 6 32 6C34 6 34 10 34 10" 
                              stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                          </svg>
                        );
                      default:
                        return null;
                    }
                  };
                  
                  return (
                    <button
                      key={collection.id}
                      onClick={() => setSelectedCollection(collection.id)}
                      className={`w-full text-left rounded-lg transition-all duration-300 overflow-hidden ${
                        isSelected ? "shadow-lg" : "shadow-sm hover:shadow-md"
                      }`}
                    >
                      <div className={`flex items-center gap-4 p-4 ${
                        isSelected
                          ? "bg-[#8B1E1E] text-white"
                          : "bg-white text-[#8B1E1E] border border-gray-200 hover:border-[#8B1E1E]"
                      }`}>
                        {/* Line Art Icon */}
                        <div className="flex-shrink-0">
                          {getCollectionIcon(collection.id)}
                        </div>
                        
                        {/* Collection Text */}
                        <div className="flex-1">
                          <div className="font-bold text-sm leading-tight mb-1" style={{ fontFamily: "'Crimson Text', serif" }}>
                            {collection.title}
                          </div>
                          <div className="text-xs opacity-90 tracking-wide">
                            {collection.subtitle}
                          </div>
                        </div>
                        
                        {/* Arrow Icon */}
                        <ChevronRight className="w-5 h-5 flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Help Section */}
              <div className="px-6 pb-6 pt-2 text-center">
                <p className="text-sm text-gray-600 italic mb-2" style={{ fontFamily: "'Crimson Text', serif" }}>
                  Need help choosing?
                </p>
                <button className="text-[#8B1E1E] font-bold text-sm underline hover:text-[#6B1515] tracking-wider">
                  ASK AACHI
                </button>
              </div>
            </div>
          </aside>

          {/* Right Content - Products */}
          <div className="lg:col-span-3">
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
