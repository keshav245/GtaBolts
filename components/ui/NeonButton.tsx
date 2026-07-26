import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export default function NeonButton({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: NeonButtonProps) {
  return (
    <button
      className={cn(
        'font-display font-semibold rounded-md transition-all duration-200 relative overflow-hidden',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-7 py-3.5 text-base',
        variant === 'primary' &&
          'bg-gradient-to-r from-violet to-violet-bright text-white shadow-glow-violet hover:shadow-glow-violet hover:brightness-110 active:scale-[0.98]',
        variant === 'secondary' &&
          'glass text-cyan border-cyan/30 hover:bg-cyan/10 hover:border-cyan/60 active:scale-[0.98]',
        variant === 'ghost' && 'text-fog hover:text-white hover:bg-white/5 active:scale-[0.98]',
        variant === 'danger' &&
          'bg-alert/10 border border-alert/40 text-alert hover:bg-alert/20 active:scale-[0.98]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
