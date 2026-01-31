"use client";

import React from "react";
import Image from "next/image";
import ProductCard from "@/components/shop/ProductCard";
import ProductDetails from "@/components/shop/ProductDetails";
import Footer from "@/components/layout/Footer";
import { ChevronRight, Filter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
          {/* Darker gradient overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(80, 15, 15, 0.98) 0%, rgba(100, 20, 20, 0.9) 50%, rgba(100, 20, 20, 0.75) 75%, rgba(80, 15, 15, 0.5) 100%)' }}></div>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Elegant Category Filter */}
        <div className="flex flex-col items-center mb-10">
          {/* Category Tabs */}
          <div className="inline-flex items-center bg-white rounded-full p-1.5 shadow-lg border border-[#E5D2C5]">
            <button
              onClick={() => setSelectedCollection('all')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${selectedCollection === 'all'
                  ? 'bg-gradient-to-r from-[#8B1E1E] to-[#6B1616] text-white shadow-md'
                  : 'text-[#8B1E1E] hover:bg-[#FAF7F2]'
                }`}
            >
              All Spices
            </button>
            <button
              onClick={() => setSelectedCollection('whole-spices')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${selectedCollection === 'whole-spices'
                  ? 'bg-gradient-to-r from-[#8B1E1E] to-[#6B1616] text-white shadow-md'
                  : 'text-[#8B1E1E] hover:bg-[#FAF7F2]'
                }`}
            >
              Whole Spices
            </button>
            <button
              onClick={() => setSelectedCollection('ground-powders')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${selectedCollection === 'ground-powders'
                  ? 'bg-gradient-to-r from-[#8B1E1E] to-[#6B1616] text-white shadow-md'
                  : 'text-[#8B1E1E] hover:bg-[#FAF7F2]'
                }`}
            >
              Powders
            </button>
            <button
              onClick={() => setSelectedCollection('secret-blends')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${selectedCollection === 'secret-blends'
                  ? 'bg-gradient-to-r from-[#8B1E1E] to-[#6B1616] text-white shadow-md'
                  : 'text-[#8B1E1E] hover:bg-[#FAF7F2]'
                }`}
            >
              Secret Blends
            </button>
          </div>
        </div>

        {/* Products Grid - Big Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onSelect={handleProductSelect}
              index={index}
            />
          ))}
        </div>

        {/* Product Details Modal Overlay */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleCloseDetails}
            >
              <motion.div
                className="relative w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ProductDetails
                  product={selectedProduct}
                  onClose={handleCloseDetails}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
