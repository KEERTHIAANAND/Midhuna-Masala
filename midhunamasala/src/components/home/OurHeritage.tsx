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
        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
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

        {/* ─── "Our Craft" Circular Seal CTA ─── */}
        <div className="flex justify-center mt-16 sm:mt-24">
          <Link href="/our-craft" className="group relative flex items-center justify-center">
            {/* Rotating Text Ring (SVG) */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 animate-[spin_12s_linear_infinite] group-hover:animate-[spin_6s_linear_infinite] transition-all duration-500">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#8B1E1E]">
                <path
                  id="circlePath"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                  fill="transparent"
                />
                <text className="font-serif text-[11px] uppercase tracking-[0.16em]" fill="currentColor">
                  <textPath href="#circlePath" startOffset="0%">
                    DISCOVER OUR CRAFT ✦ STONE GROUND ✦ 
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Inner Circular Button */}
            <div className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 bg-[#8B1E1E] rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(139,30,30,0.3)] transition-all duration-500 group-hover:bg-[#6A1515] group-hover:scale-110">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37] transition-transform duration-500 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Decorative pattern border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center overflow-hidden">
        <div className="flex gap-4 text-[#D4AF37] opacity-60">
          {[...Array(50)].map((_, i) => (
            <span key={i} className="text-lg">✦</span>
          ))}
        </div>
      </div>
    </section>
  );
}
