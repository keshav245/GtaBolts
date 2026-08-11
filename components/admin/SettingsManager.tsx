'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useToast } from '@/components/ui/ToastProvider';
import { SiteSettings } from '@/lib/queries/settings';
import { updateSiteSettings } from '@/app/admin/settings/actions';

export default function SettingsManager({ initialSettings }: { initialSettings: SiteSettings }) {
  const { showToast } = useToast();
  const [contactEmail, setContactEmail] = useState(initialSettings.contactEmail ?? '');
  const [discordUrl, setDiscordUrl] = useState(initialSettings.discordUrl ?? '');
  const [twitterUrl, setTwitterUrl] = useState(initialSettings.twitterUrl ?? '');
  const [telegramUrl, setTelegramUrl] = useState(initialSettings.telegramUrl ?? '');
  const [instagramUrl, setInstagramUrl] = useState(initialSettings.instagramUrl ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await updateSiteSettings({ contactEmail, discordUrl, twitterUrl, telegramUrl, instagramUrl });
    setSaving(false);

    if (result.ok) {
      showToast('success', result.message);
    } else {
      showToast('error', result.message);
    }
  }

  return (
    <GlassCard className="p-6 space-y-5 max-w-xl">
      <p className="text-xs text-fog-dim">
        Shown in the contact section at the bottom of the homepage. Leave any field blank to hide it there.
      </p>

      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Contact email</label>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="support@yoursite.com"
          className="w-full glass rounded-md px-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Discord invite link</label>
        <input
          type="text"
          value={discordUrl}
          onChange={(e) => setDiscordUrl(e.target.value)}
          placeholder="https://discord.gg/..."
          className="w-full glass rounded-md px-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Telegram link</label>
        <input
          type="text"
          value={telegramUrl}
          onChange={(e) => setTelegramUrl(e.target.value)}
          placeholder="https://t.me/..."
          className="w-full glass rounded-md px-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Instagram link</label>
        <input
          type="text"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          placeholder="https://instagram.com/..."
          className="w-full glass rounded-md px-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">X / Twitter link</label>
        <input
          type="text"
          value={twitterUrl}
          onChange={(e) => setTwitterUrl(e.target.value)}
          placeholder="https://x.com/..."
          className="w-full glass rounded-md px-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
        />
      </div>

      <NeonButton onClick={handleSave} disabled={saving}>
        {saving ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
          </span>
        ) : (
          'Save changes'
        )}
      </NeonButton>
    </GlassCard>
  );
}
