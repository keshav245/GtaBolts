import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  reticle?: boolean;
  strong?: boolean;
}

export default function GlassCard({ className, reticle = false, strong = false, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        strong ? 'glass-strong' : 'glass',
        'rounded-lg transition-all duration-200',
        reticle && 'reticle hover:border-violet/40 hover:shadow-glow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
