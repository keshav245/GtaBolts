import Hero from '@/components/landing/Hero';
import PurchaseTicker from '@/components/landing/PurchaseTicker';
import FeaturedCarousel from '@/components/landing/FeaturedCarousel';
import CategoryGrid from '@/components/landing/CategoryGrid';
import { getPublishedMods, getCategoryCounts } from '@/lib/queries/mods';
import { getCategories } from '@/lib/queries/categories';

export default async function LandingPage() {
  const [mods, counts, categories] = await Promise.all([getPublishedMods(), getCategoryCounts(), getCategories()]);

  return (
    <>
      <Hero />
      <PurchaseTicker />
      <FeaturedCarousel mods={mods} />
      <CategoryGrid categories={categories} counts={counts} />
    </>
  );
}
