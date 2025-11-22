'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-140px)] bg-[#992c2c] flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* In a real app, use next/image here with object-cover */}
        <div className="w-full h-full bg-[url('/images/banners/banner3.jpg')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-[#8B1E1E]/40"></div>
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 w-full">
        <div className="border-2 border-[#F6C84C] p-12 md:p-16 text-center relative backdrop-blur-sm bg-[#8B1E1E]/50">
          {/* Inner Border Effect (Double Border) */}
          <div className="absolute inset-1 border border-[#F6C84C]/50 pointer-events-none"></div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="text-[#F6C84C]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-[#171717] font-bold tracking-[0.3em] text-sm md:text-base mb-4 uppercase opacity-70">
            Aachi's Kitchen Secrets
          </p>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white font-serif mb-6 tracking-wide">
            Midhuna Masala
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-[#f6c94cf6] font-serif italic mb-10">
            Hand-pounded, Sun-dried, and filled with love.
          </p>

          {/* Button */}
          <Link 
            href="/shop"
            className="inline-block border border-white text-white px-8 py-3 text-sm font-bold tracking-[0.2em] hover:bg-white hover:text-[#8B1E1E] transition-all duration-300 uppercase"
          >
            Explore Our Spices
          </Link>
        </div>
      </div>

      {/* Admin Button */}
      <div className="absolute bottom-8 right-8 z-20">
        <button className="bg-[#0F172A] text-white p-4 rounded-full shadow-lg hover:bg-[#1E293B] transition-colors flex flex-col items-center justify-center w-16 h-16">
          <ShieldCheck className="h-6 w-6 mb-1" />
          <span className="text-[10px] font-bold">ADMIN</span>
        </button>
      </div>
    </section>
  );
}
