import ModerationTable from '@/components/admin/ModerationTable';
import { getPlatformMods } from '@/lib/queries/admin';

export default async function AdminModerationPage() {
  const mods = await getPlatformMods();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Platform-wide</p>
        <h1 className="font-display font-bold text-3xl">Mod moderation</h1>
      </div>
      <ModerationTable mods={mods} />
    </div>
  );
}
