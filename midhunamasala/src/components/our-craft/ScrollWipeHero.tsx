'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, MotionValue, useSpring } from 'framer-motion';

const SLIDES = [
  {
    word: "AUTHENTIC",
    label: "",
    image: "https://res.cloudinary.com/dstspf8bo/image/upload/v1781170134/slide_1_xpqear.png",
    mobileImage: "https://res.cloudinary.com/dstspf8bo/image/upload/f_auto,q_auto/v1/1.png",
    overlayGradient: "linear-gradient(to bottom, rgba(140, 90, 10, 0.75) 0%, rgba(180, 120, 20, 0.55) 50%, rgba(100, 60, 5, 0.80) 100%)",
  },
  {
    word: "TRADITIONAL",
    label: "AGRICULTURE",
    image: "https://res.cloudinary.com/dstspf8bo/image/upload/v1781170133/slide_2_v9cano.png",
    mobileImage: "https://res.cloudinary.com/dstspf8bo/image/upload/f_auto,q_auto/v1/2.png",
    overlayGradient: "linear-gradient(to bottom, rgba(20, 55, 20, 0.75) 0%, rgba(35, 80, 35, 0.55) 50%, rgba(15, 45, 15, 0.80) 100%)",
  },
  {
    word: "HANDCRAFTED",
    label: "ART FORMS",
    image: "https://res.cloudinary.com/dstspf8bo/image/upload/v1781170138/slide_3_bn3svr.jpg",
    mobileImage: "https://res.cloudinary.com/dstspf8bo/image/upload/f_auto,q_auto/v1/3.png",
    overlayGradient: "linear-gradient(to bottom, rgba(100, 15, 25, 0.75) 0%, rgba(130, 25, 35, 0.55) 50%, rgba(80, 10, 20, 0.80) 100%)",
  },
  {
    word: "SUN-DRIED",
    label: "TEXTILES",
    image: "https://res.cloudinary.com/dstspf8bo/image/upload/v1781170132/slide_4_eafpx2.jpg",
    mobileImage: "https://res.cloudinary.com/dstspf8bo/image/upload/f_auto,q_auto/v1/4.png",
    overlayGradient: "linear-gradient(to bottom, rgba(30, 15, 60, 0.75) 0%, rgba(45, 25, 85, 0.55) 50%, rgba(25, 12, 55, 0.80) 100%)",
  },
  {
    word: "PURE",
    label: "ARCHITECTURE",
    image: "https://res.cloudinary.com/dstspf8bo/image/upload/v1781170132/slide_5_nucevc.jpg",
    mobileImage: "https://res.cloudinary.com/dstspf8bo/image/upload/f_auto,q_auto/v1/5.png",
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
  const start = (index - 1) / (totalSlides - 1);
  const end = index / (totalSlides - 1);

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
      {/* Background Image (Standard Full Bleed for Desktop) */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.word}
          fill
          className="object-cover"
          priority={index <= 1}
          quality={85}
        />
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

      {/* Light opacity label text */}
      {slide.label && (
        <h2
          className="absolute z-10 text-[10vw] sm:text-[12vw] font-bold font-serif tracking-tighter uppercase leading-none select-none pointer-events-none text-center px-4 whitespace-nowrap text-white/[0.15]"
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

function MobileSlideLayer({
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
  const start = (index - 1) / (totalSlides - 1);
  const end = index / (totalSlides - 1);
  
  // Uses the EXACT same vertical wipe effect as the desktop version!
  const clipPath = useTransform(
    scrollYProgress,
    [start, end],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.2)]"
      style={{
        zIndex: index,
        clipPath: index === 0 ? "inset(0% 0 0 0)" : clipPath
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={slide.mobileImage}
          alt={slide.word}
          fill
          className="object-cover" // Fills the entire screen. ZERO empty space.
          priority={index <= 1}
          quality={85}
        />
        {/* Overlay to ensure consistency with desktop gradient */}
        <div 
          className="absolute inset-0"
          style={{ background: slide.overlayGradient }}
        />
      </div>

      {slide.label && (
        <h2
          className="absolute z-10 text-[10vw] sm:text-[12vw] font-bold font-serif tracking-tighter uppercase leading-none select-none pointer-events-none text-center px-4 whitespace-nowrap text-white/[0.35] drop-shadow-md"
        >
          {slide.label}
        </h2>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </motion.div>
  );
}

function MobileFullscreenHero({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const totalSlides = SLIDES.length;

  return (
    <div className="relative w-full h-full bg-[#050202] overflow-hidden">
      
      <div className="absolute inset-0 w-full h-full">
         {SLIDES.map((slide, index) => (
           <MobileSlideLayer 
             key={`img-${index}`} 
             slide={slide} 
             index={index} 
             totalSlides={totalSlides} 
             scrollYProgress={scrollYProgress} 
           />
         ))}
      </div>
      
      {/* Scroll Hint */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
      >
        <span className="text-white/60 text-[10px] tracking-[0.4em] uppercase mb-2 drop-shadow-md">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </div>
  );
}

export default function ScrollWipeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the entire 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Apply spring physics for the mobile text fades
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative w-full h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        
        {/* MOBILE VIEW (Fullscreen Immersive) */}
        <div className="block md:hidden w-full h-full">
          <MobileFullscreenHero scrollYProgress={smoothProgress} />
        </div>

        {/* DESKTOP VIEW (Scroll Parallax Wipe) */}
        <div className="hidden md:block w-full h-full">
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
    </div>
  );
}
