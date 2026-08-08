import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-white/10 mt-24">
      <div className="mx-auto max-w-7xl px-8 py-10 flex items-center justify-between text-sm text-fog-dim">
        <p className="font-mono">© {new Date().getFullYear()} GTABOLTS.SYS</p>
        <div className="flex gap-6">
          <Link href="/browse" className="hover:text-cyan transition-colors">Browse</Link>
          <Link href="/auth" className="hover:text-cyan transition-colors">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
