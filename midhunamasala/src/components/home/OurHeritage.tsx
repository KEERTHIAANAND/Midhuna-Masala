'use client';

import Link from 'next/link';

export default function OurHeritage() {
  const heritageItems = [
    {
      id: 1,
      title: "Pure Powders",
      subtitle: "Manjal & Milagai",
      image: "/images/masalas/turmeric-powder.jpg",
      description: "Traditional stone-ground turmeric and chili powders"
    },
    {
      id: 2,
      title: "Chettinad Blends",
      subtitle: "Secret Recipes",
      image: "/images/masalas/masala-powder.jpg",
      description: "Authentic spice blends from our grandmother's kitchen"
    },
    {
      id: 3,
      title: "Whole Spices",
      subtitle: "Direct from Farm",
      image: "/images/masalas/wheat-flour.jpg",
      description: "Sun-dried whole spices from our village farms"
    }
  ];

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-[#EBE4D8] relative overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center">
      {/* Decorative pattern border at top */}
      <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center overflow-hidden">
        <div className="flex gap-4 text-[#D4AF37] opacity-60">
          {[...Array(50)].map((_, i) => (
            <span key={i} className="text-lg">✦</span>
          ))}
        </div>
      </div>

      {/* Dotted background pattern */}
      <div className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#8B1E1E 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 md:mb-25">
          {/* Decorative line with icon */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-14 sm:w-24 h-px bg-[#8B1E1E]"></div>
            <div className="text-[#8B1E1E]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="w-14 sm:w-24 h-px bg-[#8B1E1E]"></div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#8B1E1E] font-serif mb-2">
            Our Heritage
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#8B1E1E] italic font-serif">
            Authentic varieties from the heart of Tamil Nadu
          </p>
        </div>

        {/* Heritage Items Grid */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-16 sm:mb-24 md:mb-28">
          {heritageItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center group">
              {/* Circular Image Container */}
              <div className="relative mb-3 scale-90">
                {/* Outer golden ring */}
                <div className="absolute inset-0 rounded-full border-5 border-[#D4AF37] transform group-hover:scale-105 transition-transform duration-300"></div>

                {/* Inner golden ring */}
                <div className="absolute inset-1 rounded-full border-2 border-[#D4AF37]/60"></div>

                {/* Image container */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full overflow-hidden bg-white p-0.5 sm:p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {/* Placeholder - Replace with actual image */}
                    <div className="text-gray-400 text-sm">Product Image</div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm md:text-lg font-bold text-[#8B1E1E] font-serif">
                  {item.title}
                </h3>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Decorative pattern border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="flex gap-4 text-[#D4AF37] opacity-60">
          {[...Array(50)].map((_, i) => (
            <span key={i} className="text-lg">✦</span>
          ))}
        </div>
      </div>

      {/* ─── "Our Craft" Momentum Arrow CTA (Corner Positioned) ─── */}
      <Link
        href="/our-craft"
        className="absolute bottom-8 right-6 sm:bottom-12 sm:right-12 z-30 group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#8B1E1E]/5 hover:bg-[#8B1E1E]/10 border border-[#8B1E1E]/20 backdrop-blur-sm transition-all duration-500 overflow-hidden"
        aria-label="Discover Our Craft"
      >
        {/* Idle Icon (Minimalist Diamond) */}
        <div className="absolute w-3 h-3 border-[1.5px] border-[#8B1E1E] rotate-45 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-16 group-hover:opacity-0 group-hover:rotate-90" />

        {/* Hover Arrow (Elegant arrow sliding in from left) */}
        <div className="absolute flex items-center justify-center -translate-x-16 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0 group-hover:opacity-100">
          <svg 
            className="w-8 h-8 sm:w-10 sm:h-10 text-[#8B1E1E] group-hover:text-[#D4AF37] transition-colors duration-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m0 0l-6-6m6 6l-6 6" />
          </svg>
        </div>
      </Link>
    </section>
  );
}
