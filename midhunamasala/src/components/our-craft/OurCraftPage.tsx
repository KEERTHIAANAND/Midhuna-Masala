'use client';

import ScrollWipeHero from './ScrollWipeHero';
import ThreeDExhibit from './ThreeDExhibit';
import CraftToolsScroll from './CraftToolsScroll';
import ComparisonSection from './ComparisonSection';
import CraftCTA from './CraftCTA';
import Footer from '@/components/layout/Footer';

export default function OurCraftPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1A0A0A]">
      {/* The new immersive scrolling hero */}
      <ScrollWipeHero />

      {/* The new Interactive 3D/Tactile Exhibit Section */}
      <ThreeDExhibit />

      {/* The new Horizontal Sticky Scroll */}
      <CraftToolsScroll />

      {/* Comparison Section (re-themed for Farm Minerals) */}
      <ComparisonSection />

      {/* Call to Action (re-themed for Farm Minerals) */}
      <CraftCTA />

      <Footer />
    </div>
  );
}
