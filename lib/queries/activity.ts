import { createClient } from '@/lib/supabase/server';

export interface ActivityItem {
  id: string;
  type: 'purchase' | 'new_mod' | 'new_category';
  text: string;
  timeLabel: string;
}

// Keeps the "someone just bought this" flavor without ever publishing a real
// email address on a public page — first 2 + last 2 characters of the local
// part, everything else masked.
function maskEmail(email: string): string {
  const local = email.split('@')[0];
  if (local.length <= 4) return `${local[0]}•••`;
  return `${local.slice(0, 2)}•••${local.slice(-2)}`;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export async function getActivityFeed(): Promise<ActivityItem[]> {
  const supabase = await createClient();

  const [{ data: purchases }, { data: newMods }, { data: newCategories }] = await Promise.all([
    supabase
      .from('purchases')
      .select('id, created_at, user_id, mod_id')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('mods')
      .select('id, title, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(4),
    supabase.from('categories').select('id, name, created_at').order('created_at', { ascending: false }).limit(3),
  ]);

  interface RawItem {
    id: string;
    type: ActivityItem['type'];
    text: string;
    occurredAt: string;
  }
  const items: RawItem[] = [];

  if (purchases && purchases.length > 0) {
    const userIds = [...new Set(purchases.map((p) => p.user_id))];
    const modIds = [...new Set(purchases.map((p) => p.mod_id))];
    const [{ data: profiles }, { data: mods }] = await Promise.all([
      supabase.from('profiles').select('id, email').in('id', userIds),
      supabase.from('mods').select('id, title').in('id', modIds),
    ]);
    const emailById = new Map((profiles ?? []).map((p) => [p.id, p.email]));
    const titleById = new Map((mods ?? []).map((m) => [m.id, m.title]));

    purchases.forEach((p) => {
      const email = emailById.get(p.user_id);
      const title = titleById.get(p.mod_id);
      if (!email || !title) return;
      items.push({
        id: `purchase-${p.id}`,
        type: 'purchase',
        text: `${maskEmail(email)} unlocked ${title}`,
        occurredAt: p.created_at,
      });
    });
  }

  (newMods ?? []).forEach((m) => {
    items.push({
      id: `mod-${m.id}`,
      type: 'new_mod',
      text: `New mod published: ${m.title}`,
      occurredAt: m.created_at,
    });
  });

  (newCategories ?? []).forEach((c) => {
    items.push({
      id: `category-${c.id}`,
      type: 'new_category',
      text: `New category added: ${c.name}`,
      occurredAt: c.created_at,
    });
  });

  return items
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 10)
    .map((item) => ({ id: item.id, type: item.type, text: item.text, timeLabel: timeAgo(item.occurredAt) }));
}
