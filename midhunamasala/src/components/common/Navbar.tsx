'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  
  return (
    <>
      {/* Marquee Section */}
      <div className="bg-[#8B1E1E] text-[#F6C84C] py-2 overflow-hidden whitespace-nowrap relative z-50">
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              animation: marquee 25s linear infinite;
            }
          `
        }} />
        <div className="animate-marquee inline-block">
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL & SUN DRIED</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL & SUN DRIED</span>
        </div>
        <div className="animate-marquee inline-block absolute top-2 left-0">
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL & SUN DRIED</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL & SUN DRIED</span>
        </div>
      </div>

      {/* Navbar Section */}
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
                className={`text-[#8B1E1E] font-bold text-xs hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase pb-1 ${
                  pathname === '/' ? 'border-b-2 border-[#D4AF37]' : ''
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`text-[#8B1E1E] font-bold text-xs hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase pb-1 ${
                  pathname === '/shop' ? 'border-b-2 border-[#D4AF37]' : ''
                }`}
              >
                Our Spices
              </Link>
              <Link
                href="/track-order"
                className={`text-[#8B1E1E] font-bold text-xs hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase pb-1 ${
                  pathname === '/track-order' ? 'border-b-2 border-[#D4AF37]' : ''
                }`}
              >
                Track Order
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center">
              <Link href="/cart" className="text-[#8B1E1E] hover:text-[#D4AF37] transition-colors relative">
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#8B1E1E] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
