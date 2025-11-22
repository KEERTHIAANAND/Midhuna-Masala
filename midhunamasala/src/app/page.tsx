import HeroSection from '@/components/layout/HeroSection';
import FeaturedProducts from '@/components/layout/FeaturedProducts';
import BrandStory from '@/components/layout/BrandStory';
import Testimonials from '@/components/layout/Testimonials';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturedProducts />
      <BrandStory />
      <Testimonials />
      <Footer />
    </div>
  );
}
