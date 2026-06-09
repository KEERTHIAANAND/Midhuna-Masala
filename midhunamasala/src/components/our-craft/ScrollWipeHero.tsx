'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const SLIDES = [
  {
    word: "AUTHENTIC",
    bg: "bg-[#8B1E1E]", // Deep Red
    text: "text-[#FFFDF5]", // Off-white
  },
  {
    word: "TRADITIONAL",
    bg: "bg-[#FFFDF5]", // Off-white
    text: "text-[#8B1E1E]", // Deep Red
  },
  {
    word: "HANDCRAFTED",
    bg: "bg-[#D4AF37]", // Gold
    text: "text-[#FFFDF5]", // Off-white
  },
  {
    word: "SUN-DRIED",
    bg: "bg-[#2C3E2D]", // Earthy Dark Green
    text: "text-[#F6C84C]", // Bright Gold
  },
  {
    word: "PURE",
    bg: "bg-[#0A0A0A]", // Dark/Black for premium feel
    text: "text-[#D4AF37]", // Gold
  }
];

function SlideLayer({
  slide,
  index,
  totalSlides,
  scrollYProgress
}: {
  slide: typeof SLIDES[0];
  index: number;
  totalSlides: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Each slide transitions in sequentially. 
  // Slide 0 is always fully visible (behind everything).
  // Slide 1 animates from 0% to 25% scroll.
  // Slide 2 from 25% to 50%, etc.
  const start = (index - 1) / (totalSlides - 1);
  const end = index / (totalSlides - 1);

  // clip-path: inset(top right bottom left).
  // 100% top means it's fully cut off (hidden).
  // 0% top means it's fully revealed.
  // This mimics the background wiping UPwards over the fixed text!
  const clipPath = useTransform(
    scrollYProgress,
    [start, end],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  return (
    <motion.div
      style={{
        zIndex: index,
        clipPath: index === 0 ? "inset(0% 0 0 0)" : clipPath
      }}
      className={`absolute inset-0 flex items-center justify-center ${slide.bg} shadow-[0_-10px_30px_rgba(0,0,0,0.2)]`}
    >
      {/* Top Left Branding */}
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12 mix-blend-difference">
        <span className="text-white/80 font-serif font-bold text-lg sm:text-xl tracking-widest">
          Midhuna Masala
        </span>
      </div>

      {/* Scroll Down Indicators (Sides) */}
      {index < totalSlides - 1 && (
        <>
          <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 -rotate-90 origin-center mix-blend-difference">
            <span className="text-white/50 text-xs sm:text-sm tracking-[0.3em] uppercase">Scroll Down</span>
          </div>
          <div className="absolute right-4 sm:right-12 top-1/2 translate-y-1/2 rotate-90 origin-center mix-blend-difference">
            <span className="text-white/50 text-xs sm:text-sm tracking-[0.3em] uppercase">Scroll Down</span>
          </div>
        </>
      )}

      {/* Main Huge Word - it stays perfectly centered! */}
      <h1
        className={`text-[12vw] sm:text-[10vw] font-bold font-serif tracking-tighter uppercase ${slide.text} leading-none`}
        style={{
          textShadow: index === 1 ? 'none' : '0 10px 30px rgba(0,0,0,0.15)'
        }}
      >
        {slide.word}
      </h1>

      {/* Dotted pattern overlay for texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
    </motion.div>
  );
}

export default function ScrollWipeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the entire 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    // Total height = 500vh so we have 4 scrollable "pages" of space to transition
    <div ref={containerRef} className="relative w-full h-[500vh]">
      {/* The sticky container locks to the screen while we scroll through the 500vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {SLIDES.map((slide, index) => (
          <SlideLayer
            key={index}
            slide={slide}
            index={index}
            totalSlides={SLIDES.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}
