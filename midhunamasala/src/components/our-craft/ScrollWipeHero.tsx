'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const SLIDES = [
  {
    word: "AUTHENTIC",
    label: "",
    image: "/images/slides/slide 1.png",
    // Golden amber — matches the warm temple silhouette tones
    overlayGradient: "linear-gradient(to bottom, rgba(140, 90, 10, 0.75) 0%, rgba(180, 120, 20, 0.55) 50%, rgba(100, 60, 5, 0.80) 100%)",
  },
  {
    word: "TRADITIONAL",
    label: "AGRICULTURE",
    image: "/images/slides/slide 2.png",
    // Deep earthy green — matches agriculture/farming lush greens
    overlayGradient: "linear-gradient(to bottom, rgba(20, 55, 20, 0.75) 0%, rgba(35, 80, 35, 0.55) 50%, rgba(15, 45, 15, 0.80) 100%)",
  },
  {
    word: "HANDCRAFTED",
    label: "ART FORMS",
    image: "/images/slides/slide 3.jpeg",
    // Rich maroon/crimson — matches Bharatanatyam/cultural arts costumes
    overlayGradient: "linear-gradient(to bottom, rgba(100, 15, 25, 0.75) 0%, rgba(130, 25, 35, 0.55) 50%, rgba(80, 10, 20, 0.80) 100%)",
  },
  {
    word: "SUN-DRIED",
    label: "TEXTILES",
    image: "/images/slides/slide 4.jpeg",
    // Deep indigo/purple — complements the vibrant textile reds & greens
    overlayGradient: "linear-gradient(to bottom, rgba(30, 15, 60, 0.75) 0%, rgba(45, 25, 85, 0.55) 50%, rgba(25, 12, 55, 0.80) 100%)",
  },
  {
    word: "PURE",
    label: "ARCHITECTURE",
    image: "/images/slides/slide 5.jpeg",
    // Warm terracotta/sandstone — matches the temple stone architecture
    overlayGradient: "linear-gradient(to bottom, rgba(110, 55, 20, 0.75) 0%, rgba(150, 80, 35, 0.55) 50%, rgba(90, 45, 15, 0.80) 100%)",
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
      className="absolute inset-0 flex items-center justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.2)]"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.word}
          fill
          className="object-cover"
          priority={index <= 1}
          quality={85}
        />
        {/* Color Overlay (like the hero section red effect) */}
        <div 
          className="absolute inset-0"
          style={{ background: slide.overlayGradient }}
        />
      </div>

      {/* Scroll Down Indicators (Sides) - Only on the first slide */}
      {index === 0 && (
        <>
          <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
            <span className="text-white/50 text-xs sm:text-sm tracking-[0.3em] uppercase">Scroll Down</span>
          </div>
          <div className="absolute right-4 sm:right-12 top-1/2 translate-y-1/2 rotate-90 origin-center">
            <span className="text-white/50 text-xs sm:text-sm tracking-[0.3em] uppercase">Scroll Down</span>
          </div>
        </>
      )}

      {/* Light opacity label text (slides 2-5 only) */}
      {slide.label && (
        <h2
          className="absolute z-10 text-[14vw] sm:text-[12vw] font-bold font-serif tracking-tighter uppercase text-white/[0.15] leading-none select-none pointer-events-none"
        >
          {slide.label}
        </h2>
      )}

      {/* Subtle vignette overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)' 
        }}
      />
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
