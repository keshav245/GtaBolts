import { Mail, MessageCircle, Twitter, Send, Instagram } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { SiteSettings } from '@/lib/queries/settings';

export default function ContactSection({ settings }: { settings: SiteSettings }) {
  const hasAnyContact =
    settings.contactEmail || settings.discordUrl || settings.twitterUrl || settings.telegramUrl || settings.instagramUrl;
  if (!hasAnyContact) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <GlassCard strong className="p-8 md:p-12 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-3">// Get in touch</p>
        <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">Questions, feedback, or a mod idea?</h2>
        <p className="text-fog mb-8 max-w-lg mx-auto">
          Reach out through any of the channels below — we read everything.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {settings.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md glass hover:border-violet/40 hover:shadow-glow-sm transition-all text-sm"
            >
              <Mail className="w-4 h-4 text-violet-bright" />
              {settings.contactEmail}
            </a>
          )}
          {settings.discordUrl && (
            <a
              href={settings.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-md glass hover:border-cyan/40 hover:shadow-glow-cyan transition-all text-sm"
            >
              <MessageCircle className="w-4 h-4 text-cyan" />
              Join our Discord
            </a>
          )}
          {settings.telegramUrl && (
            <a
              href={settings.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-md glass hover:border-cyan/40 hover:shadow-glow-cyan transition-all text-sm"
            >
              <Send className="w-4 h-4 text-cyan" />
              Telegram
            </a>
          )}
          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-md glass hover:border-violet/40 hover:shadow-glow-sm transition-all text-sm"
            >
              <Instagram className="w-4 h-4 text-violet-bright" />
              Instagram
            </a>
          )}
          {settings.twitterUrl && (
            <a
              href={settings.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-md glass hover:border-white/30 transition-all text-sm"
            >
              <Twitter className="w-4 h-4 text-fog" />
              Follow us
            </a>
          )}
        </div>
      </GlassCard>
    </section>
  );
}
