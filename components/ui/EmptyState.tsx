import { LucideIcon, SearchX } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export default function EmptyState({ icon: Icon = SearchX, title, description, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-violet/10 animate-pulse" />
        <Icon className="w-9 h-9 text-violet-bright relative" />
      </div>
      <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
      <p className="text-fog max-w-sm mb-6">{description}</p>
      {ctaLabel && onCta && (
        <NeonButton variant="secondary" onClick={onCta}>
          {ctaLabel}
        </NeonButton>
      )}
    </div>
  );
}
