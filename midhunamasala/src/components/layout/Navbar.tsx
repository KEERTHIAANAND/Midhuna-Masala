'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-[#FFFDF5] border-b border-[#E5D2C5] relative">
      {/* Dotted pattern overlay */}
      <div className="absolute inset-0 opacity-50 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#8B1E1E 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex flex-col">
              <span className="text-4xl font-bold text-[#8B1E1E] font-serif tracking-wide">
                Midhuna Masala
              </span>
              <span className="text-[10px] font-bold text-[#8B1E1E] tracking-[0.2em] uppercase mt-1 text-center w-full">
                Traditional Stone Ground Spices
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              href="/"
              className="text-[#8B1E1E] font-bold text-xs hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase border-b-2 border-[#D4AF37] pb-1"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-[#8B1E1E] font-bold text-xs hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase"
            >
              Our Spices
            </Link>
            <Link
              href="/track-order"
              className="text-[#8B1E1E] font-bold text-xs hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase"
            >
              Track Order
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center">
            <button className="text-[#8B1E1E] hover:text-[#D4AF37] transition-colors">
              <ShoppingBag className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
