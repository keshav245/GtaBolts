import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#0a0a0f',
        ink: '#12121a',
        'ink-light': '#1a1a26',
        violet: {
          DEFAULT: '#8b5cf6',
          bright: '#a78bfa',
          dim: '#6d28d9',
        },
        cyan: {
          DEFAULT: '#22d3ee',
          bright: '#67e8f9',
          dim: '#0891b2',
        },
        signal: '#39ff88',
        alert: '#ff2e63',
        fog: '#a1a1aa',
        'fog-dim': '#71717a',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'mesh-gradient':
          'radial-gradient(at 20% 20%, rgba(139,92,246,0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(34,211,238,0.2) 0px, transparent 50%), radial-gradient(at 40% 80%, rgba(139,92,246,0.15) 0px, transparent 50%)',
        'grid-lines':
          'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      boxShadow: {
        'glow-violet': '0 0 20px rgba(139,92,246,0.35), 0 0 40px rgba(139,92,246,0.15)',
        'glow-cyan': '0 0 20px rgba(34,211,238,0.35), 0 0 40px rgba(34,211,238,0.15)',
        'glow-sm': '0 0 12px rgba(139,92,246,0.25)',
      },
      keyframes: {
        'mesh-shift': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '50%': { transform: 'translate(-3%, 2%) scale(1.05)' },
        },
        'ticker-scroll': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'reticle-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        'mesh-shift': 'mesh-shift 18s ease-in-out infinite',
        'ticker-scroll': 'ticker-scroll 40s linear infinite',
        'reticle-in': 'reticle-in 0.2s ease-out',
        blink: 'blink 1s step-start infinite',
      },
    },
  },
  plugins: [],
};

export default config;
