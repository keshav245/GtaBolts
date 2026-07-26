'use client';

import { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import NeonButton from '@/components/ui/NeonButton';
import GoogleButton from '@/components/auth/GoogleButton';

type Mode = 'sign-in' | 'sign-up';

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleGoogleSignIn() {
    setLoading(true);
    // TODO: supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${origin}/auth/callback` } })
    setTimeout(() => setLoading(false), 1000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // TODO: mode === 'sign-in'
    //   ? supabase.auth.signInWithPassword({ email, password })
    //   : supabase.auth.signUp({ email, password })
    setTimeout(() => {
      setLoading(false);
      setError('Auth isn\u2019t wired up yet \u2014 this is a UI stub.');
    }, 1000);
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex glass rounded-md p-1 mb-6">
        {(['sign-in', 'sign-up'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 py-2 text-sm font-display font-semibold rounded-md transition-all',
              mode === m ? 'bg-violet/20 text-violet-bright shadow-glow-sm' : 'text-fog-dim hover:text-fog'
            )}
          >
            {m === 'sign-in' ? 'Sign in' : 'Sign up'}
          </button>
        ))}
      </div>

      <GoogleButton onClick={handleGoogleSignIn} loading={loading} />

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-white/10" />
        <span className="font-mono text-[11px] text-fog-dim uppercase tracking-wider">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fog-dim" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full glass rounded-md pl-9 pr-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-fog-dim">Password</label>
            {mode === 'sign-in' && (
              <button type="button" className="text-xs text-cyan hover:text-cyan-bright transition-colors">
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fog-dim" />
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full glass rounded-md pl-9 pr-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-alert bg-alert/10 border border-alert/30 rounded-md px-3 py-2">{error}</p>
        )}

        <NeonButton type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Please wait...
            </span>
          ) : mode === 'sign-in' ? (
            'Sign in'
          ) : (
            'Create account'
          )}
        </NeonButton>
      </form>

      <p className="text-xs text-fog-dim text-center mt-6">
        By continuing you agree to the marketplace terms and mod licensing policy.
      </p>
    </div>
  );
}
