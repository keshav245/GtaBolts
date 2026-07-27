import ModerationTable from '@/components/admin/ModerationTable';
import { PLATFORM_MODS } from '@/lib/admin-data';

export default function AdminModerationPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Platform-wide</p>
        <h1 className="font-display font-bold text-3xl">Mod moderation</h1>
      </div>
      <ModerationTable mods={PLATFORM_MODS} />
    </div>
  );
}
