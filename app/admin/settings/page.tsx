import SettingsManager from '@/components/admin/SettingsManager';
import { getSiteSettings } from '@/lib/queries/settings';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Site config</p>
        <h1 className="font-display font-bold text-3xl">Contact settings</h1>
      </div>
      <SettingsManager initialSettings={settings} />
    </div>
  );
}
