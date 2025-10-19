// Shop page was removed per request. Keep this placeholder so routes don't break — delete file when ready.

"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
// PromoSlider removed from this page in favor of a static banner
import ProductCard from "@/components/ui/ProductCard";
import styles from "@/components/ui/shop.module.css";

const products = [
  { id: "turmeric", name: "Curry Masala", price: "£5.00", image: "/images/products/turmeric.svg", rating: 5 },
  { id: "pepper", name: "Pepper Mix", price: "£5.00", image: "/images/products/pepper.svg", rating: 5 },
  { id: "mustard", name: "Mustard Powder", price: "£5.00", image: "/images/products/mustard.svg", rating: 5 },
  { id: "star-anise", name: "Garam Masala", price: "£5.00", image: "/images/products/star-anise.svg", rating: 5 },
  { id: "nutmeg", name: "Nutmeg Blend", price: "£5.00", image: "/images/products/nutmeg.svg", rating: 5 },
  { id: "ginger", name: "Dry Ginger", price: "£5.00", image: "/images/products/ginger.svg", rating: 5 },
  { id: "asafoetida", name: "Asafoetida", price: "£5.00", image: "/images/products/asafoetida.svg", rating: 5 },
  { id: "chilli", name: "Chilli Powder", price: "£5.00", image: "/images/products/chilli.svg", rating: 5 },
];

export default function ShopPage() {
  return (
    <div>
      <Navbar />

      {/* Full-bleed static promotional banner (image covers entire width) */}
      <section className="w-full mb-8">
        {/* expand to viewport width and remove page padding so banner is truly edge-to-edge */}
        <div className="w-screen -mx-4 sm:-mx-6 lg:-mx-8">
              <div className={`relative h-64 sm:h-96 md:h-[640px] w-screen overflow-hidden ${styles.bannerContainer}`}>
            <img src="/images/banners/spices-banner.png" alt="Spices banner" className={`absolute inset-0 w-full h-full object-cover ${styles.bannerImg}`} />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <section className="mt-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured Products</h2>
          </div>

          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

