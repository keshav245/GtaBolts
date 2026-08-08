import Hero from '@/components/landing/Hero';
import PurchaseTicker from '@/components/landing/PurchaseTicker';
import FeaturedCarousel from '@/components/landing/FeaturedCarousel';
import CategoryGrid from '@/components/landing/CategoryGrid';
import FeaturedVideos from '@/components/landing/FeaturedVideos';
import { getPublishedMods, getCategoryCounts } from '@/lib/queries/mods';
import { getCategories } from '@/lib/queries/categories';
import { getFeaturedVideos } from '@/lib/queries/videos';

export default async function LandingPage() {
  const [mods, counts, categories, videos] = await Promise.all([
    getPublishedMods(),
    getCategoryCounts(),
    getCategories(),
    getFeaturedVideos(),
  ]);

  return (
    <>
      <Hero />
      <PurchaseTicker />
      <FeaturedCarousel mods={mods} />
      <CategoryGrid categories={categories} counts={counts} />
      <FeaturedVideos videos={videos} />
    </>
  );
}
