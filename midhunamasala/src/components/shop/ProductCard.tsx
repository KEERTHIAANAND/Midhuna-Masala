"use client";

import Image from "next/image";
import React from "react";
import styles from "./shop.module.css";
import { Heart, ShoppingCart, Star } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className={`bg-white rounded-lg border-2 border-orange-200 overflow-hidden ${styles.card} hover:border-orange-400 transition-colors`}>
      <div className="relative p-6 bg-white">
        <div className="w-full h-40 relative flex items-center justify-center">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 200px, 250px" 
            className="object-contain"
          />
        </div>
      </div>

      <div className="p-4 text-center bg-white">
        <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
      </div>
    </div>
  );
}
