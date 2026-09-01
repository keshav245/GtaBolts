import { notFound } from 'next/navigation';
import EditModForm from '@/components/dashboard/EditModForm';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth-guards';
import { getCategories } from '@/lib/queries/categories';

interface EditModPageProps {
  params: { slug: string };
}

export default async function EditModPage({ params }: EditModPageProps) {
  await requireRole('employee');
  const supabase = await createClient();
  const categories = await getCategories();

  // RLS scopes this to mods the signed-in employee owns (or any mod, for an
  // owner) — a mod belonging to someone else simply won't be returned here.
  const { data: mod } = await supabase
    .from('mods')
    .select('title, description, category, price_in_paise')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!mod) notFound();

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
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  );
}
