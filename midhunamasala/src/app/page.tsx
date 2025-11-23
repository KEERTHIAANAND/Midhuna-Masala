import HeroSection from '@/components/home/HeroSection';
import OurHeritage from '@/components/home/OurHeritage';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandStory from '@/components/home/BrandStory';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <OurHeritage />
      <BrandStory />
      <Testimonials />
      <Footer />
    </div>
  );
}
