"use client";

import React from "react";
import Image from "next/image";
import ProductCard from "@/components/shop/ProductCard";

const products = [
  { id: "cumin", name: "Cumin Seeds", category: "Ground", image: "/images/products/cumin.jpg" },
  { id: "sesame", name: "Sesame Seeds", category: "Blended", image: "/images/products/sesame.jpg" },
  { id: "fennel", name: "Fennel Seeds", category: "Ground", image: "/images/products/fennel.jpg" },
  { id: "coriander", name: "Coriander Seeds", category: "Ground", image: "/images/products/coriander.jpg" },
  { id: "groundnuts", name: "Groundnuts", category: "Other", image: "/images/products/groundnuts.jpg" },
  { id: "fenugreek", name: "Fenugreek Seeds", category: "Ground", image: "/images/products/fenugreek.jpg" },
  { id: "flax", name: "Flax Seeds", category: "Spice", image: "/images/products/flax.jpg" },
  { id: "dill", name: "Dill Seeds", category: "Spice", image: "/images/products/dill.jpg" },
];

const categories = ["Our Products Here..", "Blended", "Ground", "Other", "Spice"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("Our Products Here..");
  
  return (
    <div>
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
            quality={50} 
            style={{ objectFit: "cover" }}
          />
          {/* Maroon gradient overlay on left side for text background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B1E1E] via-[#8B1E1E]/80 to-transparent" style={{ width: '85%' }}></div>
        </div>

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-start justify-center px-8 md:px-16 lg:px-24">
          {/* Premium Selection Badge */}
          <div className="flex items-center gap-3 mb-4">
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
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-2" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 700 }}>
            The Royal
          </h1>
          <h1 className="text-5xl md:text-7xl font-serif text-[#F6C84C] mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 700 }}>
            Spice Pantry
          </h1>

          {/* Divider */}
          <div className="w-1 h-12 bg-white mb-4"></div>

          {/* Subheading */}
          <p className="text-white text-lg md:text-xl italic max-w-2xl" style={{ fontFamily: "'Crimson Text', serif" }}>
            'Curated for the connoisseurs of authentic Chettinad cuisine.'
          </p>
        </div>

        {/* Bottom Golden Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F6C84C] to-[#D4AF37]"></div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white rounded-lg p-6">
          {/* Category Header */}
          <div className="mb-6">
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
              <span className="font-medium">PRODUCTS</span>
              <div className="flex-1 border-t-2 border-dotted border-gray-300 ml-4"></div>
            </div>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    index === 0 
                      ? "bg-orange-100 text-orange-600 border border-orange-300" 
                      : selectedCategory === category
                      ? "bg-blue-100 text-blue-600 border border-blue-300"
                      : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products
              .filter(p => selectedCategory === "Our Products Here.." || p.category === selectedCategory)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
