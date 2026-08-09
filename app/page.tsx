import Hero from '@/components/landing/Hero';
import ActivityTicker from '@/components/landing/ActivityTicker';
import FeaturedCarousel from '@/components/landing/FeaturedCarousel';
import CategoryGrid from '@/components/landing/CategoryGrid';
import FeaturedVideos from '@/components/landing/FeaturedVideos';
import ContactSection from '@/components/landing/ContactSection';
import { getPublishedMods, getCategoryCounts } from '@/lib/queries/mods';
import { getCategories } from '@/lib/queries/categories';
import { getFeaturedVideos } from '@/lib/queries/videos';
import { getSiteSettings } from '@/lib/queries/settings';
import { getActivityFeed } from '@/lib/queries/activity';

export default async function LandingPage() {
  const [mods, counts, categories, videos, settings, activity] = await Promise.all([
    getPublishedMods(),
    getCategoryCounts(),
    getCategories(),
    getFeaturedVideos(),
    getSiteSettings(),
    getActivityFeed(),
  ]);

  return (
    <>
      <Hero />
      <ActivityTicker items={activity} />
      <FeaturedCarousel mods={mods} />
      <CategoryGrid categories={categories} counts={counts} />
      <FeaturedVideos videos={videos} />
      <ContactSection settings={settings} />
    </>
  );
}
