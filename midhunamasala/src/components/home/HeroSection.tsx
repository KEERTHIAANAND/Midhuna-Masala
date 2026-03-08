'use client';

import Link from 'next/link';
import CloudImage from '@/components/common/CloudImage';

export default function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] bg-[#992c2c] flex items-center justify-center overflow-hidden">
      {/* Background Image with Cloudinary CDN */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full opacity-60 relative">
          <CloudImage
            src="/images/banners/banner3.jpg"
            alt="Midhuna Masala Hero Background"
            fill
            priority
            className="object-cover"
            quality={80}
          />
        </div>
        <div className="absolute inset-0 bg-[#8B1E1E]/40"></div>
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 w-full">
        <div className="p-6 sm:p-10 md:p-12 lg:p-16 text-center relative bg-red-900/80 backdrop-blur-md border border-yellow-500/30">
          {/* Inner Border Effect (Double Border) */}
          <div className="absolute inset-1 border border-[#F6C84C]/50 pointer-events-none"></div>

          {/* Icon */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="text-[#F6C84C]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-[#171717] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm md:text-base mb-3 sm:mb-4 uppercase opacity-70">
            Aachi's Kitchen Secrets
          </p>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white font-serif mb-4 sm:mb-6 tracking-wide">
            Midhuna Masala
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#f6c94cf6] font-serif italic mb-6 sm:mb-10">
            Hand-pounded, Sun-dried, and filled with love.
          </p>

          {/* Button */}
          <Link
            href="/shop"
            className="inline-block border border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] hover:bg-white hover:text-[#8B1E1E] transition-all duration-300 uppercase"
          >
            Explore Our Spices
          </Link>
        </div>
      </div>
    </section>
  );
}
