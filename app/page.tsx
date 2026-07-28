import Hero from '@/components/landing/Hero';
import PurchaseTicker from '@/components/landing/PurchaseTicker';
import FeaturedCarousel from '@/components/landing/FeaturedCarousel';
import CategoryGrid from '@/components/landing/CategoryGrid';
import { getPublishedMods, getCategoryCounts } from '@/lib/queries/mods';

export default async function LandingPage() {
  const [mods, counts] = await Promise.all([getPublishedMods(), getCategoryCounts()]);

  return (
    <>
      <Hero />
      <PurchaseTicker />
      <FeaturedCarousel mods={mods} />
      <CategoryGrid counts={counts} />
    </>
  );
}
