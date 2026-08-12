import { notFound } from 'next/navigation';
import EditModForm from '@/components/dashboard/EditModForm';
import { createClient } from '@/lib/supabase/server';
import { getScreenshotUrl } from '@/lib/r2';
import { requireRole } from '@/lib/auth-guards';

interface EditModPageProps {
  params: { slug: string };
}

export default async function EditModPage({ params }: EditModPageProps) {
  await requireRole('employee');
  const supabase = await createClient();

  // RLS scopes this to mods the signed-in employee owns (or any mod, for an
  // owner) — a mod belonging to someone else simply won't be returned here.
  const { data: mod } = await supabase
    .from('mods')
    .select('title, description, category, price_in_paise, screenshots')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!mod) notFound();

  const { data: categoryRows } = await supabase.from('categories').select('slug, name').order('name');

  const existingScreenshots = await Promise.all(
    (mod.screenshots as string[]).map(async (key) => ({
      key,
      url: await getScreenshotUrl(key),
    }))
  );

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Edit mod</p>
        <h1 className="font-display font-bold text-3xl">{mod.title}</h1>
      </div>

      <EditModForm
        slug={params.slug}
        initialTitle={mod.title}
        initialDescription={mod.description ?? ''}
        initialCategory={mod.category}
        initialPriceInPaise={mod.price_in_paise}
        initialScreenshots={existingScreenshots}
        categories={categoryRows ?? []}
      />
    </div>
  );
}
