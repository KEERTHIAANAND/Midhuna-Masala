'use client';

export default function OurHeritage() {
  const heritageItems = [
    {
      id: 1,
      title: "Pure Powders",
      subtitle: "Manjal & Milagai",
      image: "/images/products/pure-powders.jpg",
      description: "Traditional stone-ground turmeric and chili powders"
    },
    {
      id: 2,
      title: "Chettinad Blends",
      subtitle: "Secret Recipes",
      image: "/images/products/chettinad-blends.jpg",
      description: "Authentic spice blends from our grandmother's kitchen"
    },
    {
      id: 3,
      title: "Whole Spices",
      subtitle: "Direct from Farm",
      image: "/images/products/whole-spices.jpg",
      description: "Sun-dried whole spices from our village farms"
    }
  ];

  return (
    <section className="py-24 bg-[#EBE4D8] relative overflow-hidden min-h-[600px] flex items-center">
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
        <div className="text-center mb-25">
          {/* Decorative line with icon */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-24 h-px bg-[#8B1E1E]"></div>
            <div className="text-[#8B1E1E]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="w-24 h-px bg-[#8B1E1E]"></div>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-[#8B1E1E] font-serif mb-2">
            Our Heritage
          </h2>
          <p className="text-base md:text-lg text-[#8B1E1E] italic font-serif">
            Authentic varieties from the heart of Tamil Nadu
          </p>
        </div>

        {/* Heritage Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {heritageItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center group">
              {/* Circular Image Container */}
              <div className="relative mb-3 scale-90">
                {/* Outer golden ring */}
                <div className="absolute inset-0 rounded-full border-5 border-[#D4AF37] transform group-hover:scale-105 transition-transform duration-300"></div>
                
                {/* Inner golden ring */}
                <div className="absolute inset-1 rounded-full border-2 border-[#D4AF37]/60"></div>
                
                {/* Image container */}
                <div className="relative w-44 h-44 rounded-full overflow-hidden bg-white p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {/* Placeholder - Replace with actual image */}
                    <div className="text-gray-400 text-sm">Product Image</div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-[#8B1E1E] font-serif">
                  {item.title}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
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
