"use client";

import React from "react";
import Image from "next/image";
import ProductCard from "@/components/shop/ProductCard";
import ProductDetails from "@/components/shop/ProductDetails";
import Footer from "@/components/layout/Footer";
import { ChevronRight, Filter } from "lucide-react";

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
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const detailsRef = React.useRef<HTMLDivElement>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Scroll to details section
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

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
    <div className="bg-[#EBE3D5]">
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
          {/* Dark gradient overlay - solid dark on left for text, fading to transparent on right for image */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(139, 30, 30, 0.95) 0%, rgba(139, 30, 30, 0.7) 60%, rgba(139, 30, 30, 0.35) 85%, transparent 100%)' }}></div>
        </div>

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 max-w-3xl">
          {/* Premium Selection Badge */}
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase font-medium">
              Premium Selection
            </span>
            <svg className="w-5 h-5 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F5E6D3] leading-tight" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 700 }}>
            The Royal
          </h1>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#D4AF37] mb-6 leading-tight" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 700 }}>
            Spice Pantry
          </h1>

          {/* Decorative Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-[#D4AF37]"></div>
            <svg className="w-4 h-4 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <div className="w-12 h-[2px] bg-[#D4AF37]"></div>
          </div>

          {/* Subheading */}
          <p className="text-[#F5E6D3] text-base md:text-lg leading-relaxed italic" style={{ fontFamily: "'Crimson Text', serif" }}>
            Curated for the connoisseurs of authentic Chettinad cuisine
          </p>
        </div>

        {/* Bottom Golden Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B]"></div>
      </section>

      {/* Main Shop Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Sidebar - Collections */}
          <aside className="lg:col-span-1 -ml-22">
            {/* Pie Chart Circle */}
            <div className="flex flex-col items-start">
              <div className="relative w-96 h-96">
                {/* SVG Pie Chart with labels */}
                <svg className="w-full h-full" viewBox="0 0 240 240">
                  <defs>
                    {/* Gradients for segments */}
                    <radialGradient id="redGrad" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="#8B1E1E" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#A02C2C" stopOpacity="1" />
                    </radialGradient>
                    <radialGradient id="sandalGrad" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="#E5D4B8" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#D4C4A8" stopOpacity="1" />
                    </radialGradient>
                  </defs>

                  {/* All Products - Red segment when selected (top, 25%) */}
                  <g
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedCollection('all')}
                    style={{ filter: selectedCollection === 'all' ? 'drop-shadow(0 0 6px rgba(139, 30, 30, 0.5))' : 'none' }}
                  >
                    <path
                      d="M 120 120 L 120 30 A 90 90 0 0 1 210 120 L 120 120 Z"
                      fill={selectedCollection === 'all' ? 'url(#redGrad)' : 'url(#sandalGrad)'}
                      className="opacity-100 hover:opacity-95"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x="165"
                      y="77"
                      textAnchor="middle"
                      className={`text-[10px] font-bold pointer-events-none ${selectedCollection === 'all' ? 'fill-white' : 'fill-[#8B1E1E]'}`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      ALL
                    </text>
                    <text
                      x="165"
                      y="88"
                      textAnchor="middle"
                      className={`text-[8px] pointer-events-none ${selectedCollection === 'all' ? 'fill-white/90' : 'fill-[#8B1E1E]/80'}`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      PRODUCTS
                    </text>
                  </g>
                  {/* Whole Spices - Red when selected (right, 25%) */}
                  <g
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedCollection('whole-spices')}
                    style={{ filter: selectedCollection === 'whole-spices' ? 'drop-shadow(0 0 6px rgba(139, 30, 30, 0.5))' : 'none' }}
                  >
                    <path
                      d="M 120 120 L 210 120 A 90 90 0 0 1 120 210 L 120 120 Z"
                      fill={selectedCollection === 'whole-spices' ? 'url(#redGrad)' : 'url(#sandalGrad)'}
                      className="opacity-100 hover:opacity-95"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x="172"
                      y="155"
                      textAnchor="middle"
                      className={`text-[10px] font-bold pointer-events-none ${selectedCollection === 'whole-spices' ? 'fill-white' : 'fill-[#8B1E1E]'}`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      WHOLE
                    </text>
                    <text
                      x="172"
                      y="166"
                      textAnchor="middle"
                      className={`text-[8px] pointer-events-none ${selectedCollection === 'whole-spices' ? 'fill-white/90' : 'fill-[#8B1E1E]/80'}`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      SPICES
                    </text>
                  </g>

                  {/* Ground Powders - Red when selected (bottom, 25%) */}
                  <g
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedCollection('ground-powders')}
                    style={{ filter: selectedCollection === 'ground-powders' ? 'drop-shadow(0 0 6px rgba(139, 30, 30, 0.5))' : 'none' }}
                  >
                    <path
                      d="M 120 120 L 120 210 A 90 90 0 0 1 30 120 L 120 120 Z"
                      fill={selectedCollection === 'ground-powders' ? 'url(#redGrad)' : 'url(#sandalGrad)'}
                      className="opacity-100 hover:opacity-95"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x="75"
                      y="157"
                      textAnchor="middle"
                      className={`text-[10px] font-bold pointer-events-none ${selectedCollection === 'ground-powders' ? 'fill-white' : 'fill-[#8B1E1E]'}`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      GROUND
                    </text>
                    <text
                      x="75"
                      y="168"
                      textAnchor="middle"
                      className={`text-[8px] pointer-events-none ${selectedCollection === 'ground-powders' ? 'fill-white/90' : 'fill-[#8B1E1E]/80'}`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      POWDERS
                    </text>
                  </g>

                  {/* Secret Blends - Red when selected (left, 25%) */}
                  <g
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedCollection('secret-blends')}
                    style={{ filter: selectedCollection === 'secret-blends' ? 'drop-shadow(0 0 6px rgba(139, 30, 30, 0.5))' : 'none' }}
                  >
                    <path
                      d="M 120 120 L 30 120 A 90 90 0 0 1 120 30 L 120 120 Z"
                      fill={selectedCollection === 'secret-blends' ? 'url(#redGrad)' : 'url(#sandalGrad)'}
                      className="opacity-100 hover:opacity-95"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x="72"
                      y="77"
                      textAnchor="middle"
                      className={`text-[10px] font-bold pointer-events-none ${selectedCollection === 'secret-blends' ? 'fill-white' : 'fill-[#8B1E1E]'}`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      SECRET
                    </text>
                    <text
                      x="72"
                      y="88"
                      textAnchor="middle"
                      className={`text-[8px] pointer-events-none ${selectedCollection === 'secret-blends' ? 'fill-white/90' : 'fill-[#8B1E1E]/80'}`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      BLENDS
                    </text>
                  </g>

                  {/* Center white circle */}
                  <circle cx="120" cy="120" r="35" fill="white" stroke="#D4AF37" strokeWidth="2" />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-sm text-[#755C48] tracking-widest uppercase font-extrabold text-center" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>
                    Pantry<br />Items
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content - Products */}
          <div className="lg:col-span-3">
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProduct?.id === product.id}
                  onSelect={handleProductSelect}
                />
              ))}
            </div>

            {/* Product Details Modal Overlay */}
            {selectedProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="relative w-full max-w-5xl max-h-[90vh] overflow-auto">
                  <ProductDetails
                    product={selectedProduct}
                    onClose={handleCloseDetails}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
