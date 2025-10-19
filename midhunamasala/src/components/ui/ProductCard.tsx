"use client";

import Image from "next/image";
import React from "react";
import styles from "./shop.module.css";
import { Heart, ShoppingCart, Star } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  rating?: number;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${styles.card}`}>
      <div className="relative">
        <div className="p-6 flex items-center justify-center bg-gray-50">
          <div className="w-32 h-32 relative">
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 120px, 160px" className="object-contain" />
          </div>
        </div>

        <button className={`${styles.addButton} bg-red-600 text-white px-4 py-2 rounded-md`}>Add to cart</button>
      </div>

      <div className="p-4 text-center">
        <div className="text-xs text-gray-400 uppercase">spice</div>
        <h3 className="mt-2 text-sm font-medium text-gray-800">{product.name}</h3>
        <div className="mt-2 text-green-600 font-semibold">{product.price}</div>

        <div className="mt-3 flex items-center justify-center gap-2 text-yellow-400">
          {Array.from({ length: product.rating ?? 5 }).map((_, i) => (
            <Star key={i} size={14} />
          ))}
        </div>
      </div>
    </div>
  );
}
