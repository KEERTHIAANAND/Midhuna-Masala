import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/layout/HeroSection';
import FeaturedProducts from '@/components/layout/FeaturedProducts';
import BrandStory from '@/components/layout/BrandStory';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <BrandStory />
    </div>
  );
}
