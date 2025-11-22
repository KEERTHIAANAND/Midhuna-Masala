// Shop page was removed per request. Keep this placeholder so routes don't break — delete file when ready.

"use client";

import React from "react";
// PromoSlider removed from this page in favor of a static banner
import ProductCard from "@/components/ui/ProductCard";
import styles from "@/components/ui/shop.module.css";

const products = [
  { id: "cumin", name: "Cumin Seeds", category: "Ground", image: "IMG-20250727-WA0004.jpg" },
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
      {/* Full-bleed static promotional banner (image covers entire width) */}
      <section className="w-full mb-8">
        {/* expand to viewport width and remove page padding so banner is truly edge-to-edge */}
        <div className="w-screen -mx-4 sm:-mx-6 lg:-mx-8">
              <div className={`relative h-64 sm:h-96 md:h-[640px] w-screen overflow-hidden ${styles.bannerContainer}`}>
            <img src="/images/banners/spices-banner.png" alt="Spices banner" className={`absolute inset-0 w-full h-full object-cover ${styles.bannerImg}`} />
          </div>
        </div>
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

