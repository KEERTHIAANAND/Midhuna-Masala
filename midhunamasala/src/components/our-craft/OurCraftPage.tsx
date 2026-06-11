'use client';

import ScrollWipeHero from './ScrollWipeHero';
import MasalaCarousel from './MasalaCarousel';

import Footer from '@/components/layout/Footer';
import { useEffect } from 'react';

export default function OurCraftPage() {
  // Force scroll to top when landing on this page to ensure the hero animation starts correctly
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1A0A0A]">
      {/* The new immersive scrolling hero */}
      <ScrollWipeHero />

      {/* Scroll-driven Masala Circular Carousel — below the PURE slide */}
      <MasalaCarousel />


      <Footer />
    </div>
  );
}
