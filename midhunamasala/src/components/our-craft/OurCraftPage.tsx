'use client';

import ScrollWipeHero from './ScrollWipeHero';
import MasalaCarousel from './MasalaCarousel';

import Footer from '@/components/layout/Footer';

export default function OurCraftPage() {
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
