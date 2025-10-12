'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-white flex items-center">
      {/* Background placeholder - you can add your background image here later */}
      <div className="absolute inset-0 bg-white">
        {/* Placeholder for background image with kitchenware */}
        <div className="absolute inset-0 opacity-5">
          {/* This will be replaced with your background image */}
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight font-serif tracking-wider uppercase">
                <span className="block">Authentic</span>
                <span className="block">Flavors,</span>
                <span className="block">Homemade with</span>
                <span className="block">Love.</span>
              </h1>
            </div>

            {/* Descriptive Paragraph */}
            <div className="max-w-lg">
              <p className="text-lg text-gray-700 leading-relaxed font-sans tracking-wide">
                Discover traditional masalas crafted with care, bringing the rich heritage 
                of Indian kitchens directly to your home.
              </p>
            </div>

          </div>

          {/* Right side - Placeholder for background elements */}
          <div className="hidden lg:block relative">
            {/* This area will contain the background kitchenware elements */}
            {/* You can add your background image here */}
            <div className="w-full h-96 bg-gray-200 rounded-lg opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
