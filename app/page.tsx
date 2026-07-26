import Hero from '@/components/landing/Hero';
import PurchaseTicker from '@/components/landing/PurchaseTicker';
import FeaturedCarousel from '@/components/landing/FeaturedCarousel';
import CategoryGrid from '@/components/landing/CategoryGrid';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <PurchaseTicker />
      <FeaturedCarousel />
      <CategoryGrid />
    </>
  );
}
