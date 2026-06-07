'use client';

import ScrollWipeHero from './ScrollWipeHero';
import FlipCardsGallery from './FlipCardsGallery';
import Footer from '@/components/layout/Footer';

export default function OurCraftPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* The new immersive scrolling hero */}
      <ScrollWipeHero />

      <div className="h-px bg-gradient-to-r from-transparent via-[#8B1E1E]/10 to-transparent mt-12" />

      {/* Concept B: Interactive Flip Cards */}
      <FlipCardsGallery />
      
      <Footer />
    </div>
  );
}
