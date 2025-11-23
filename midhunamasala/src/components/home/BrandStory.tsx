'use client';

import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="py-20 bg-[#F5F0E8] relative overflow-hidden">
      {/* Decorative flower symbols in corners */}
      <div className="absolute top-8 left-8 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#8B1E1E]">
          <path d="M50 20 C40 20 35 30 35 35 C35 30 30 20 20 20 C20 30 30 35 35 35 C30 35 20 40 20 50 C30 50 35 40 35 35 C35 40 40 50 50 50 C50 40 40 35 35 35 C40 35 50 30 50 20 Z M50 50 C60 50 65 40 65 35 C65 40 70 50 80 50 C80 40 70 35 65 35 C70 35 80 30 80 20 C70 20 65 30 65 35 C65 30 60 20 50 20 C50 30 60 35 65 35 C60 35 50 40 50 50 Z M50 50 C40 50 35 60 35 65 C35 60 30 50 20 50 C20 60 30 65 35 65 C30 65 20 70 20 80 C30 80 35 70 35 65 C35 70 40 80 50 80 C50 70 40 65 35 65 C40 65 50 60 50 50 Z M50 50 C60 50 65 60 65 65 C65 60 70 50 80 50 C80 60 70 65 65 65 C70 65 80 70 80 80 C70 80 65 70 65 65 C65 70 60 80 50 80 C50 70 60 65 65 65 C60 65 50 60 50 50 Z" />
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 w-40 h-40 opacity-15">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#8B1E1E]">
          <path d="M50 20 C40 20 35 30 35 35 C35 30 30 20 20 20 C20 30 30 35 35 35 C30 35 20 40 20 50 C30 50 35 40 35 35 C35 40 40 50 50 50 C50 40 40 35 35 35 C40 35 50 30 50 20 Z M50 50 C60 50 65 40 65 35 C65 40 70 50 80 50 C80 40 70 35 65 35 C70 35 80 30 80 20 C70 20 65 30 65 35 C65 30 60 20 50 20 C50 30 60 35 65 35 C60 35 50 40 50 50 Z M50 50 C40 50 35 60 35 65 C35 60 30 50 20 50 C20 60 30 65 35 65 C30 65 20 70 20 80 C30 80 35 70 35 65 C35 70 40 80 50 80 C50 70 40 65 35 65 C40 65 50 60 50 50 Z M50 50 C60 50 65 60 65 65 C65 60 70 50 80 50 C80 60 70 65 65 65 C70 65 80 70 80 80 C70 80 65 70 65 65 C65 70 60 80 50 80 C50 70 60 65 65 65 C60 65 50 60 50 50 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Section with Decorative Frame */}
          <div className="order-2 lg:order-1 relative">
            {/* Traditional frame/border */}
            <div className="relative">
              {/* EST 1983 Badge */}
              <div className="absolute -top-10 -right-10 z-10">
                <div className="relative w-28 h-28 bg-gradient-to-br from-[#F6C84C] to-[#D4AF37] rounded-full shadow-2xl flex items-center justify-center animate-pulse">
                  <div className="absolute inset-2 bg-gradient-to-br from-[#F6C84C]/80 to-[#D4AF37]/80 rounded-full"></div>
                  <div className="text-center relative z-10">
                    <div className="text-[10px] font-bold text-[#8B1E1E] tracking-wider">EST.</div>
                    <div className="text-2xl font-bold text-[#8B1E1E]">1983</div>
                    <div className="text-[8px] font-semibold text-[#8B1E1E] tracking-wide">VILLAGE MADE</div>
                  </div>
                </div>
              </div>

              {/* Card with rounded corners and golden border */}
              <div className="relative bg-[#8B1E1E] rounded-[2.5rem] overflow-visible shadow-2xl border-8 border-[#D4AF37]">
                {/* Inner shadow border */}
                <div className="absolute inset-0 rounded-[2rem] border-4 border-[#F6C84C]/30 pointer-events-none m-2"></div>
                
                {/* Content area */}
                <div className="relative aspect-[4/5] p-8 flex flex-col justify-between">
                  {/* Quote at bottom */}
                  <div className="mt-auto">
                    <div className="border-l-4 border-[#F6C84C] pl-4">
                      <p className="text-[#F6C84C] text-sm md:text-2xl italic font-serif leading-relaxed">
                        "Hand-pounded with love, just like Aachi made it."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Section */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Tamil Title */}
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-[#8B1E1E] font-serif">
                எங்கள் கதை
              </h2>
              <p className="text-xl text-[#8B1E1E] italic font-serif">
                The Mithuna Legacy
              </p>
              <div className="w-24 h-1 bg-[#8B1E1E]"></div>
            </div>
            
            <div className="space-y-4 text-[#4A4A4A]">
              <p className="text-lg leading-relaxed font-serif italic">
                <span className="text-5xl font-serif text-[#8B1E1E] float-left mr-3 leading-none">M</span>
                ithuna Masala was born in the sun-drenched courtyards of Karaikudi. It started with a simple belief: <span className="font-bold text-[#8B1E1E] font-serif italic">Food is Memory.</span>
              </p>
              
              <p className="text-lg leading-relaxed font-serif italic">
                Our grandmother, <span className="font-bold">Aachi</span>, would wake up before dawn to dry the chillies on the terrace. She knew that the heat of the machine kills the aroma, but the weight of the stone mortar preserves it.
              </p>
              
              <p className="text-lg leading-relaxed font-serif italic">
                Today, we honor her legacy. Every packet of Mithuna Masala is <span className="font-bold text-[#8B1E1E]">Stone Ground</span> and <span className="font-bold text-[#8B1E1E]">Sun Dried</span>, bringing the pure, unadulterated taste of the village straight to your home.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-3 bg-[#8B1E1E] text-white font-bold rounded hover:bg-[#6B1616] transition-colors duration-200 tracking-wider uppercase text-sm group"
              >
                TASTE OUR TRADITION
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
